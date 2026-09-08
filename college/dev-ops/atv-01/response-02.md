# Testes automatizados: Synergia

**Disciplina:** DevOps, Aula 05, Projeto Integrador (Parte 2)
**Autor:** Guilherme Harmatiuk Arantes
**Versão:** 1.0
**Data:** 07/09/2026

---

## 1. O que foi entregue

Três camadas de teste sobre o código que já existe no repositório.

| Camada | Onde vive | Quantidade | O que exige para rodar |
| --- | --- | --- | --- |
| Unidade | `backend/src/test/kotlin/br/com/synergia/unit/` | 30 | nada além do JDK |
| Integração | `backend/src/test/kotlin/br/com/synergia/integration/` | 70 | PostgreSQL no ar |
| Sistema (ponta a ponta) | `frontend/cypress/e2e/` | 50 | PostgreSQL + backend + frontend |
| **Total** | | **150** | |

Todas as 150 passam. A saída da última execução completa está na seção 4.

### A regra que orientou a escrita

Nenhum teste usa mock, stub ou resposta simulada. Não há `cy.intercept`, não há
`@MockBean`, não há repositório falso. Quando um teste diz que o projeto foi
gravado, ele foi gravado numa tabela do PostgreSQL e é lido de volta de lá. Isso
foi decisão explícita, alinhada com o recado do professor sobre não entregar um
"frontend de mentira": se o sistema promete persistência, o teste tem que provar
persistência, e não a capacidade de devolver um JSON combinado de antemão.

O preço disso é que as camadas de integração e sistema precisam de infraestrutura
para rodar. A seção 3 explica como levantar essa infraestrutura em um comando.

### O que cada camada cobre

**Unidade** pega a lógica pura, que não depende de banco nem de rede:

- `StringExtensionsTest` — as extensões de String. Vale mais do que aparenta:
  `parseStringToWildCard` é a função que transforma o texto digitado na busca no
  `ILIKE` que vai para o banco, então ela está no caminho do RF05.
- `EnumsTest` — `ColorsEnum` (todo hex precisa caber na coluna `banner_color`,
  que é `VARCHAR(7) NOT NULL`) e `AuthPermissionsEnum` (ids sem repetição).
- `SqlPathTest` — confere que todo caminho de `.sql` declarado no catálogo
  aponta para um arquivo que existe mesmo no classpath. Esses caminhos são
  strings soltas: o compilador não valida nada. Sem esse teste, renomear um
  arquivo e esquecer do enum só apareceria como erro na cara do usuário.
- `EntityToDtoTest` — a conversão entidade → DTO, campo a campo, incluindo a
  garantia de que a senha não vaza para o JSON.

**Integração** sobe a aplicação inteira, com Tomcat real numa porta aleatória, e
conversa com ela por HTTP de verdade contra um PostgreSQL de verdade:

- `PageLoginIntegrationTest` (7) — login correto, senha errada, login
  inexistente, isolamento entre instituições, atualização do `last_seen`, e os
  dois ramos do `CASE WHEN` de sessão recente/vencida.
- `EntityProjectIntegrationTest` (13) — criação com vínculo do autor e das tags,
  busca por texto sem diferenciar maiúsculas, filtro por tag exigindo todas as
  tags, filtros combinados, isolamento por tenant, edição.
- `EntityAccountIntegrationTest` (17) — criação, recusa de senha vazia, busca por
  login/nome/sobrenome, checagem de login e e-mail já em uso, edição preservando
  senha em branco, exclusão.
- `EntityTenantIntegrationTest` (6) — criação da instituição junto com a conta
  ADMIN, recusa de identifier repetido, e o ciclo fechado de criar a instituição
  e autenticar com o ADMIN recém-criado.
- `EntityTagIntegrationTest` (10) — criação, as três bandeiras de uso, busca,
  tags de um projeto, edição, exclusão.
- `EntityEventIntegrationTest` (8) — o espelho do de projetos, para eventos.
- `EntityGetByIdIntegrationTest` (9) — a tela de detalhes e as bandeiras
  `lookup-tags` / `lookup-members`, que ligam consultas diferentes.

O motivo de essa camada ser a maior é simples: quase toda regra do Synergia mora
em SQL, não em Kotlin. `ILIKE`, `interval '12 hours'`,
`HAVING COUNT(DISTINCT ...)` — nada disso pode ser verificado sem um Postgres do
outro lado.

**Sistema** abre um navegador de verdade e percorre a aplicação como um aluno:

- `autenticacao.cy.ts` (6) — a instituição recém-criada aparecendo na lista de
  tenants, login certo levando ao dashboard, senha errada com mensagem de erro,
  botão desabilitado enquanto o formulário está incompleto, rota interna
  redirecionando para o login sem sessão, e a sessão sobrevivendo ao recarregar.
- `projetos.cy.ts` (11) — criar projeto pela tela e conferir por dois caminhos
  independentes que ele existe (a tela mostra, e a API confirma a linha no
  banco); o projeto sobrevivendo ao recarregar a aplicação inteira; busca por
  texto filtrando; busca indiferente a maiúsculas; busca vazia sem quebrar a
  tela; projeto de outra instituição não aparecendo; validação do botão Salvar;
  o projeto aparecendo em "Seus Projetos", que prova que o vínculo de autoria
  foi gravado; o filtro por tag da listagem; o filtro com duas tags, que exige
  que o projeto tenha as duas; e a edição pelo diálogo do card.
- `eventos.cy.ts` (9) — o espelho do de projetos, para a outra entidade que o
  Synergia publica. A repetição é proposital: o formulário de evento é um
  componente diferente, com conector, rota e endpoint próprios, e nada garante
  que ele funcione só porque o de projetos funciona.
- `tags.cy.ts` (8) — a única tela em tabela, com menu de ações: criar, buscar,
  editar título, editar as bandeiras de uso, excluir, validação do Salvar e
  isolamento entre instituições. As três bandeiras são conferidas duas vezes,
  nas caixas da tabela e coluna a coluna pela API.
- `usuarios.cy.ts` (9) — o teste mais forte da suíte está aqui: uma conta é
  criada preenchendo o formulário e, em seguida, essa mesma conta entra pela
  tela de login. Também: senha errada barrada, busca por login e por nome,
  edição, edição sem senha nova preservando a senha antiga (verificado
  entrando com ela de novo), exclusão e isolamento por instituição.
- `detalhes.cy.ts` (7) — o diálogo do card e as páginas de detalhes de projeto
  e de evento, que dependem dos `get-*-by-id` com `lookup-tags` e
  `lookup-members` ligados: título, descrição, tags e o autor entre os membros,
  chegando tanto pelo card quanto pelo menu lateral.

A navegação nos testes de sistema é feita pelo menu lateral, clicando, e não
digitando URL. Isso não foi capricho: a sessão vive em memória, então abrir
`/projects` direto pela URL cai no guard `HasActiveTenant` e volta para o login.
Clicar no menu é o caminho que o usuário real percorre. Pela mesma razão, as
telas de edição são alcançadas como o usuário as alcança - pelo botão "Editar"
dentro do diálogo do card, ou pelo menu de três pontos da linha da tabela.

---

## 2. Pré-requisitos

- **JDK 21** — `java -version` deve mostrar 21.
- **Node 20** e **npm**.
- **PostgreSQL** rodando em `localhost:5432`.
- Dependências do frontend instaladas: `cd frontend && npm ci`.

Os testes usam dois bancos separados do banco de desenvolvimento, de propósito,
para que rodar a suíte nunca apague o que você está usando para trabalhar:

| Banco | Usado por |
| --- | --- |
| `synergia_dev` | desenvolvimento normal — **os testes não tocam nele** |
| `synergia_test` | testes de integração |
| `synergia_e2e` | testes de sistema |

Crie os dois bancos de teste uma vez:

```bash
psql -h localhost -U raindrop -d postgres \
  -c "CREATE DATABASE synergia_test OWNER raindrop;" \
  -c "CREATE DATABASE synergia_e2e OWNER raindrop;"
```

Não é preciso criar tabela nenhuma: o Hibernate está com `ddl-auto: update` e
monta o esquema a partir das entidades na primeira execução.

---

## 3. Como executar

### 3.1 Testes de unidade

Os mais rápidos, e os únicos que não precisam de nada além do JDK. Use-os
enquanto estiver escrevendo código.

```bash
cd backend
./gradlew unitTest
```

Saída esperada, no fim:

```
Resultado: SUCCESS (30 testes, 30 passaram, 0 falharam, 0 pulados)
```

### 3.2 Testes de integração

Precisam do PostgreSQL no ar. Não precisam do backend rodando: o próprio teste
sobe a aplicação.

```bash
cd backend
./gradlew integrationTest
```

```
Resultado: SUCCESS (70 testes, 70 passaram, 0 falharam, 0 pulados)
```

O endereço do banco tem valor padrão embutido, mas pode ser trocado por variável
de ambiente, para apontar a suíte para outro PostgreSQL:

```bash
TEST_DB_URL=jdbc:postgresql://localhost:5432/synergia_test \
TEST_DB_USERNAME=raindrop \
TEST_DB_PASSWORD=MaybeLater \
./gradlew integrationTest
```

Cada teste limpa as tabelas antes de rodar, na ordem que respeita as chaves
estrangeiras, então a ordem de execução não importa e um teste nunca depende do
que outro deixou para trás.

### 3.3 As duas camadas do backend de uma vez

```bash
cd backend
./gradlew test
```

Roda unidade e integração juntas (100 testes).

### 3.4 Testes de sistema (ponta a ponta)

Estes exigem a pilha inteira no ar. São três terminais, ou três comandos em
background.

**Terminal 1 — backend no perfil de e2e:**

```bash
cd backend
./gradlew bootRun --args='--spring.profiles.active=e2e'
```

O perfil está em `src/main/resources/application-e2e.yaml` e só troca o banco:
aponta para `synergia_e2e` em vez de `synergia_dev`. Como é um arquivo
`application-{perfil}.yaml`, ele tem precedência sobre o
`application-datasource.yaml` importado pelo `application.yaml`, então não é
preciso comentar nem editar nada para alternar.

Espere a linha `Started SynergiaApplicationKt`. O log de inicialização diz qual
banco foi usado (`HikariPool ... synergia_e2e`). Para conferir:

```bash
curl -X POST http://localhost:8080/api/entity-tenant/list-all-tenants
```

**Terminal 2 — frontend:**

```bash
cd frontend
npx nx serve synergia-frontend --port 4201
```

Espere `Application bundle generation complete`.

**Terminal 3 — Cypress:**

```bash
cd frontend
npm run e2e
```

Saída esperada:

```
✔  autenticacao.cy.ts    6 tests, 6 passing
✔  detalhes.cy.ts        7 tests, 7 passing
✔  eventos.cy.ts         9 tests, 9 passing
✔  projetos.cy.ts       11 tests, 11 passing
✔  tags.cy.ts            8 tests, 8 passing
✔  usuarios.cy.ts        9 tests, 9 passing
✔  All specs passed!    50  50
```

Se o Cypress morrer logo na largada com `bad option: --no-sandbox` ou
`cachedDataRejected`, o problema não é a instalação: é a variável
`ELECTRON_RUN_AS_NODE=1`, que o terminal integrado do VS Code exporta e que faz
o Electron do Cypress rodar como se fosse Node puro. Rode fora do VS Code, ou
tire a variável só para esse comando:

```bash
env -u ELECTRON_RUN_AS_NODE npm run e2e
```

Para acompanhar os testes rodando no navegador, o que ajuda quando algum falha:

```bash
cd frontend
npm run e2e:open
```

A massa de dados dos testes de sistema é criada chamando a API real, e cada
execução usa um identificador único (`e2e-<timestamp>`). Por isso não é preciso
limpar o banco de e2e entre execuções — mas se ele crescer demais, é só
recriá-lo:

```bash
psql -h localhost -U raindrop -d postgres \
  -c "DROP DATABASE synergia_e2e;" \
  -c "CREATE DATABASE synergia_e2e OWNER raindrop;"
```

### 3.5 Resumo dos comandos

| Objetivo | Comando | Precisa de |
| --- | --- | --- |
| Unidade | `cd backend && ./gradlew unitTest` | JDK |
| Integração | `cd backend && ./gradlew integrationTest` | + PostgreSQL |
| Unidade + integração | `cd backend && ./gradlew test` | + PostgreSQL |
| Sistema | `cd frontend && npm run e2e` | + backend e frontend no ar |
| Sistema, com janela | `cd frontend && npm run e2e:open` | idem |

### 3.6 Onde ficam os relatórios

Depois de rodar, o Gradle grava um relatório navegável em HTML:

- `backend/build/reports/tests/unitTest/index.html`
- `backend/build/reports/tests/integrationTest/index.html`

Quando um teste de sistema falha, o Cypress salva a captura de tela do momento
exato em `frontend/cypress/screenshots/`.

---

## 4. Resultado da última execução completa

```
$ cd backend && ./gradlew clean unitTest integrationTest
Resultado: SUCCESS (30 testes, 30 passaram, 0 falharam, 0 pulados)
Resultado: SUCCESS (70 testes, 70 passaram, 0 falharam, 0 pulados)
BUILD SUCCESSFUL in 1m 2s

$ cd frontend && npm run e2e
  ✔  autenticacao.cy.ts    00:25    6    6    -    -    -
  ✔  detalhes.cy.ts        00:34    7    7    -    -    -
  ✔  eventos.cy.ts         01:05    9    9    -    -    -
  ✔  projetos.cy.ts        01:11   11   11    -    -    -
  ✔  tags.cy.ts            00:49    8    8    -    -    -
  ✔  usuarios.cy.ts        01:20    9    9    -    -    -
  ✔  All specs passed!     05:26   50   50    -    -    -
```

---

## 5. O que os testes encontraram

Escrever a suíte serviu para achar coisa quebrada, que é metade do motivo de
escrevê-la. Segue o que apareceu.

### 5.1 Bug corrigido: vírgula sobrando quebrava a validação de cadastro

`sql/page-upsert-account/get-account-by-login-or-email.sql` tinha uma vírgula
sobrando antes do `FROM`:

```sql
last_name as account_last_name,   -- <- esta vírgula
FROM account
```

Isso é erro de sintaxe no PostgreSQL. O efeito prático: **o endpoint
`get-account-by-login-or-email` respondia 500 sempre**, ou seja, a checagem de
"esse login já está em uso?" da tela de cadastro nunca funcionou. Como o
`ResponseMessenger` engole a exceção e devolve 500 com um cabeçalho, a falha
passava despercebida.

Corrigido (remoção da vírgula), e agora há cinco testes de integração cobrindo o
endpoint. Foi a única alteração que fiz em código de produção.

### 5.2 Lacunas conhecidas, deixadas de fora e documentadas

Estas ficaram sem cobertura porque a funcionalidade não existe ainda. Não são
esquecimento: onde fazia sentido, deixei um teste que registra o comportamento
atual, de modo que, quando alguém implementar, o teste falha e obriga a atualizar
a expectativa.

- **Permissões.** `sql/action-attribute-permissions/attribute-permissions.sql` e
  `sql/page-list-permissions/list-permissions.sql` estão **vazios**. Os endpoints
  correspondentes quebram. O `SqlPathTest` lista os dois explicitamente como
  "ainda sem implementação".
- **Vínculo projeto ↔ evento.** `EntityEventSqlService.listEventsByProject` tem
  corpo `return emptyList()`, e o SQL correspondente consulta a tabela
  `project_event_relationship`, que não existe no banco. Há um teste que fixa o
  contrato atual (200 com lista vazia) e explica o porquê no comentário.
- **`ActionManageRelationshipsSqlService`** tem os três métodos com corpo vazio.
  Sem comportamento para testar.
- **Autenticação por token.** O backend não tem Spring Security nem token: as
  rotas de escrita são abertas. Por isso não existe o teste de "rota protegida
  sem token responde 401" que o RNF03 previa na Parte 1. É a lacuna mais séria
  desta lista, e vale tratar antes da Parte 3.

### 5.3 O que a ampliação dos testes de sistema encontrou

Cobrir eventos, tags, usuários e as telas de detalhes obrigou a percorrer partes
da interface que ninguém tinha percorrido de ponta a ponta. Duas coisas
apareceram:

- **`get-account-by-login-or-email` não é chamado por tela nenhuma.** O endpoint
  existe, o cliente gerado em `libs/api` tem o método, e ele agora está correto
  e coberto por testes de integração (seção 5.1) - mas nenhum componente do
  frontend o invoca. Ou seja, o formulário de cadastro de usuário **não avisa**
  que um login já está em uso: só descobre quando o INSERT falha. A checagem
  precisa ser ligada na tela de upsert de conta.
- **O clique no `mat-checkbox` inteiro não marca a caixa.** O centro do elemento
  cai numa faixa morta entre a caixa e o texto. Não chega a ser bug de produto,
  porque uma pessoa clica na caixa ou no texto, e os dois funcionam - mas é uma
  armadilha para quem escreve teste, e por isso o comando `alternarCaixa` clica
  no `<label>`, com o motivo anotado no código.

### 5.4 Duas observações que não são bug, mas merecem atenção

- **Senha em texto puro.** A tabela `account` guarda a senha como veio, e o
  `check-login-information.sql` compara com `a.password = :password`. O RNF02 da
  Parte 1 pede hash (bcrypt ou pgcrypto). Há um teste que garante que a senha não
  vaza no JSON da API, mas isso não substitui o hash no banco.
- **Token do Nx Cloud comitado.** O `frontend/nx.json` tem um
  `nxCloudAccessToken` de leitura e escrita versionado no repositório, que é
  público. Convém revogar esse token e passar a injetá-lo por variável de
  ambiente. Para rodar qualquer comando do Nx sem depender desse serviço, use
  `NX_NO_CLOUD=true`.

---

## 6. O que ficou fora desta entrega

A Parte 2 pede mais coisa do que testes, e o resto ainda não foi feito:

- **Deploy na Vercel** conectado ao repositório, e **banco no Supabase**.
- **Ambiente reproduzível com Docker Compose** — existe um `Dockerfile` para o
  backend, mas não há `docker-compose.yml` levantando aplicação e banco juntos.
  Vale fazer: encurtaria a seção 3 deste documento para um comando só.
- **Pipeline de integração contínua** rodando os testes a cada push e a cada
  Pull Request (RNF08).
- **Proteção da branch `main`**: exigir Pull Request, aprovação e checks
  concluídos antes do merge.
- **Migrations versionadas** com o Supabase CLI (o adicional opcional de nota).

Também vale registrar a distância entre este repositório e o documento da Parte
1: a rastreabilidade da Parte 1 descreve um MVP com pedido de entrada, limite de
membros, projeto aberto/fechado e e-mail institucional, e **nada disso existe no
código hoje**. A suíte cobre o que o sistema realmente faz — projetos, contas,
tags, eventos, tenants e login. Quando as regras RN01 a RN10 forem implementadas,
os testes correspondentes entram nas mesmas três camadas, seguindo os padrões já
montados aqui.

---

## 7. Arquivos criados ou alterados

**Criados:**

```
backend/src/test/kotlin/br/com/synergia/unit/StringExtensionsTest.kt
backend/src/test/kotlin/br/com/synergia/unit/EnumsTest.kt
backend/src/test/kotlin/br/com/synergia/unit/SqlPathTest.kt
backend/src/test/kotlin/br/com/synergia/unit/EntityToDtoTest.kt

backend/src/test/kotlin/br/com/synergia/integration/support/IntegrationTestBase.kt
backend/src/test/kotlin/br/com/synergia/integration/PageLoginIntegrationTest.kt
backend/src/test/kotlin/br/com/synergia/integration/EntityProjectIntegrationTest.kt
backend/src/test/kotlin/br/com/synergia/integration/EntityAccountIntegrationTest.kt
backend/src/test/kotlin/br/com/synergia/integration/EntityTenantIntegrationTest.kt
backend/src/test/kotlin/br/com/synergia/integration/EntityTagIntegrationTest.kt
backend/src/test/kotlin/br/com/synergia/integration/EntityEventIntegrationTest.kt
backend/src/test/kotlin/br/com/synergia/integration/EntityGetByIdIntegrationTest.kt

frontend/cypress.config.ts
frontend/cypress/tsconfig.json
frontend/cypress/support/e2e.ts
frontend/cypress/support/commands.ts
frontend/cypress/e2e/autenticacao.cy.ts
frontend/cypress/e2e/projetos.cy.ts
frontend/cypress/e2e/eventos.cy.ts
frontend/cypress/e2e/tags.cy.ts
frontend/cypress/e2e/usuarios.cy.ts
frontend/cypress/e2e/detalhes.cy.ts
backend/src/main/resources/application-e2e.yaml
```

**Alterados:**

```
backend/build.gradle.kts                  # tasks unitTest e integrationTest, log de resultado
backend/src/main/resources/sql/page-upsert-account/get-account-by-login-or-email.sql
                                          # correção da vírgula (seção 5.1)
frontend/package.json                     # scripts e2e e e2e:open
frontend/.gitignore                       # artefatos do Cypress
```

**Removido:**

```
backend/src/test/kotlin/utils/extensions/StringTest.kt
```

Era o único teste que existia antes. Não compilava — importava
`br.com.synergia.utilsCommons.extensions`, sem o segmento `libs`, e por isso a
task `test` do Gradle falhava antes mesmo de rodar qualquer coisa. Além disso não
tinha asserção: só imprimia o resultado com `println`. Foi substituído pelo
`StringExtensionsTest`, que cobre o mesmo `cleanString` e mais duas funções, com
asserções de verdade.
