# Pipeline de integração contínua: Synergia

**Disciplina:** DevOps, Aula 05, Projeto Integrador (Parte 3)
**Autor:** Guilherme Harmatiuk Arantes
**Versão:** 2.0
**Data:** 07/09/2026

---

## 1. O que foi entregue

Um pipeline no GitHub Actions que roda as 150 testes da parte 2 a cada push e a
cada pull request, num arquivo só:

- `.github/workflows/ci.yml`

O pipeline tem quatro jobs:

| Job | Nome no GitHub | O que roda | Infraestrutura que ele levanta |
| --- | --- | --- | --- |
| `testes-unitarios` | Testes de unidade | `./gradlew unitTest` (30 testes) | JDK 21 |
| `testes-integracao` | Testes de integração | `./gradlew integrationTest` (70 testes) | + PostgreSQL 16 |
| `testes-sistema` | Testes de sistema (Cypress) | `npm run e2e` (50 testes) | + backend, Angular e navegador |
| `resultado` | Resultado dos testes | nada, só confere os três acima | — |

O `resultado` existe por um motivo específico: a proteção da branch `main`
(parte 4) precisa de um nome de check obrigatório, e é mais simples exigir um
check que resume os três do que listar três e ter que mexer na configuração toda
vez que um job for renomeado.

### Quando o pipeline dispara

```yaml
on:
  push:
    branches: ['**']
  pull_request:
    branches: [main]
```

`'**'` é qualquer branch, não só a `main`: a atividade pede "a cada push", e um
CI que só roda depois do merge descobre o problema tarde demais. O efeito
colateral conhecido é que um push numa branch que já tem PR aberto dispara duas
execuções (a do push e a do PR). É desperdício aceito de propósito, porque a
alternativa - rodar só no PR - deixa quem ainda não abriu PR sem retorno nenhum.

O que reduz esse desperdício é o bloco de concorrência:

```yaml
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

Três pushes seguidos na mesma branch não geram três execuções completas: as duas
primeiras são canceladas assim que a terceira entra. O que interessa é se o
último commit passa.

---

## 2. O desenho: por que os jobs estão nessa ordem

```
                       ┌───────────────────────┐
                       │  testes-unitarios     │   ~1 min, sem infraestrutura
                       └───────────┬───────────┘
                     ┌─────────────┴─────────────┐
                     ▼                           ▼
        ┌────────────────────────┐  ┌────────────────────────────┐
        │  testes-integracao     │  │  testes-sistema (Cypress)  │
        │  + PostgreSQL          │  │  + PostgreSQL + backend    │
        │                        │  │  + Angular + navegador     │
        └────────────┬───────────┘  └──────────────┬─────────────┘
                     └─────────────┬───────────────┘
                                   ▼
                       ┌───────────────────────┐
                       │  resultado            │   check obrigatório da main
                       └───────────────────────┘
```

Duas decisões estão nesse desenho.

**Unidade é portão, não etapa paralela.** Os testes de unidade não precisam de
nada além do JDK e terminam em segundos. Se eles quebram, o código não compila
como se espera ou uma regra pura mudou de comportamento - e não há razão para
levantar Postgres, empacotar o backend, compilar o Angular e abrir um navegador
para reconfirmar isso três vezes. É por isso que os dois jobs caros declaram
`needs: testes-unitarios`.

**Integração e sistema rodam em paralelo entre si.** Eles não dependem um do
outro, e cada um levanta o próprio PostgreSQL efêmero, em máquinas separadas.
Rodar em série só faria o retorno chegar mais tarde.

---

## 3. Job a job

### 3.1 Testes de unidade

Checkout, JDK 21 (Temurin) com cache do Gradle, e o mesmo comando do README:

```yaml
- name: Rodar os testes de unidade
  working-directory: backend
  run: ./gradlew unitTest --no-daemon
```

O `--no-daemon` está em todos os comandos do Gradle: o daemon serve para reusar
JVM entre execuções na mesma máquina, e a máquina do CI é destruída no fim do
job. Deixar o daemon ligado só gasta memória e às vezes segura o processo no
fim.

O relatório HTML do Gradle sobe como artefato (`relatorio-unidade`), com
`if: always()` - justamente quando o job falha é que se quer olhar o relatório.

### 3.2 Testes de integração

O PostgreSQL vem como *service container* do próprio job:

```yaml
services:
  postgres:
    image: postgres:16
    env:
      POSTGRES_USER: synergia
      POSTGRES_PASSWORD: synergia
      POSTGRES_DB: synergia_test
    ports: ['5432:5432']
    options: >-
      --health-cmd "pg_isready -U synergia -d synergia_test"
      ...
```

Três detalhes que importam:

- **O `--health-cmd` não é enfeite.** Sem ele o job começa a rodar assim que o
  contêiner sobe, e o Postgres ainda leva alguns segundos até aceitar conexão. O
  sintoma seria um teste falhando por `Connection refused` de vez em quando, que
  é o tipo de falha que faz o time perder a confiança no CI.
- **A senha não é segredo.** O banco nasce no começo do job e morre no fim, e não
  existe endereço pelo qual alguém de fora possa alcançá-lo. Colocar isso em
  `secrets` daria uma falsa sensação de proteção sem proteger nada.
- **Não há passo de migração.** O esquema é criado pelo Hibernate
  (`ddl-auto: update`) na primeira conexão, exatamente como acontece na máquina
  de desenvolvimento.

O endereço do banco chega aos testes pelas variáveis que a suíte já lia desde a
parte 2:

```yaml
env:
  TEST_DB_URL: jdbc:postgresql://localhost:5432/synergia_test
  TEST_DB_USERNAME: synergia
  TEST_DB_PASSWORD: synergia
```

### 3.3 Testes de sistema

Este é o job comprido, porque ele reproduz sozinho os três terminais que a seção
3.4 da parte 2 manda abrir na mão. Na ordem:

1. **JDK 21 + Node 20**, com cache do Gradle e do npm.
2. **Cache do binário do Cypress** (`~/.cache/Cypress`). O binário tem ~250 MB e
   mora fora do `node_modules`, então o cache do npm não o cobre; sem esse passo
   cada execução baixa tudo de novo.
3. **`npm ci`** no frontend - `ci` e não `install`, porque o `package-lock.json`
   é o que garante que o CI teste as mesmas versões que a máquina de
   desenvolvimento.
4. **`npx cypress verify`**, que falha em segundos se faltar biblioteca do
   Electron na imagem do runner. É um erro de ambiente, não de teste, e é melhor
   descobrir antes de gastar dez minutos levantando o resto.
5. **`./gradlew bootJar -x test`**, que empacota o backend num `.jar`. Aqui o CI
   se afasta do procedimento manual de propósito: `bootRun` deixa o processo
   pendurado num daemon do Gradle, e o que o job precisa é de um processo cujo
   PID ele conheça.
6. **Um único passo que sobe a pilha, espera e roda o Cypress.** Backend
   (`java -jar` no perfil `e2e`, com `--frontend.url` apontando para a origem
   que o navegador vai usar) e frontend (`npx nx serve --port 4201 --host
   0.0.0.0`) sobem em segundo plano, o script espera os dois responderem e só
   então roda os testes. Um `trap ... EXIT` derruba os dois no fim, aconteça o
   que acontecer.
7. **Spec de fumaça antes da suíte.** O `autenticacao.cy.ts` roda sozinho e sem
   retentativa; se ele falhar inteiro, o job aborta ali. Quando a pilha não está
   de pé, isso troca 9 minutos de log vermelho repetindo o mesmo erro por uma
   falha em ~30 segundos, com o diagnóstico junto. O preço é rodar esse spec
   duas vezes quando está tudo verde (~7 segundos).

Os pontos 6 e 7 parecem estranhos lendo o arquivo, e cada um tem uma cicatriz
por trás: a seção 6 conta quais.

A espera não é `sleep 60`, é chamada de verdade, repetida, e no mesmo endereço
que o Cypress usa:

```bash
esperar() {
  local nome="$1" url="$2" metodo="$3" log="$4"
  for i in $(seq 1 60); do
    if curl -4 -fsS -X "$metodo" "$url" > /dev/null; then
      echo "$nome no ar depois de ${i}0s."
      return 0
    fi
    sleep 10
  done
  echo "::error::$nome não respondeu em 10 minutos."
  diagnostico "espera esgotada"
  tail -n 100 "$log"
  return 1
}
```

O `-4` e os endereços em `127.0.0.1` não são preciosismo: a suíte já falhou
inteira porque a verificação subia por IPv6 e dizia "no ar" enquanto o Cypress,
que conecta por IPv4, não alcançava nada (seção 6.2). O backend é considerado no
ar quando `POST /api/entity-tenant/list-all-tenants` responde - ou seja, depois
de o Spring subir *e* conectar no banco.

Há também uma função `diagnostico`, chamada antes dos testes e de novo se eles
falharem. Ela imprime se cada processo continua vivo, em que endereço cada um
escuta (`ss -tlnp`), a memória livre e se o kernel matou alguém por falta dela.
São dez linhas de log que transformam "falhou no CI e funciona aqui" em algo
que se lê, em vez de algo que se adivinha.

No fim, com `if: always()`, sobem os artefatos: capturas de tela do Cypress
quando algum teste falha, e os logs do backend e do frontend sempre. Um teste de
sistema que quebra no CI e não quebra na máquina local é impossível de
investigar sem esses arquivos - e foi exatamente com eles que a falha da seção
6.2 foi diagnosticada.

### 3.4 Resultado

```yaml
if: always()
needs: [testes-unitarios, testes-integracao, testes-sistema]
```

O `if: always()` faz o job rodar mesmo quando um dos anteriores falha - sem ele,
o check obrigatório ficaria eternamente "pendente" num PR quebrado, em vez de
ficar vermelho, e a proteção da branch não teria o que barrar. O passo lê o
resultado dos três e falha se algum não for `success`.

---

## 4. O que precisou mudar no projeto

Quase nada, porque a parte 2 já tinha sido escrita pensando nisso.

**Já estava pronto:** os testes de integração leem `TEST_DB_URL`,
`TEST_DB_USERNAME` e `TEST_DB_PASSWORD` com valor padrão para a máquina local, e
as tarefas `unitTest` e `integrationTest` já separavam as camadas.

**Mudou um arquivo:** `backend/src/main/resources/application-e2e.yaml`. O perfil
de e2e tinha o banco fixo no arquivo:

```yaml
url: jdbc:postgresql://localhost:5432/synergia_e2e
username: raindrop
password: MaybeLater
```

Agora aceita variável de ambiente, mantendo o mesmo padrão:

```yaml
url: ${E2E_DB_URL:jdbc:postgresql://localhost:5432/synergia_e2e}
username: ${E2E_DB_USERNAME:raindrop}
password: ${E2E_DB_PASSWORD:MaybeLater}
```

O comportamento na máquina de desenvolvimento é idêntico ao de antes - quem não
define nada continua caindo no `synergia_e2e` local com o usuário local. A
alternativa seria criar no runner um usuário `raindrop` com a senha da minha
máquina, o que funcionaria e seria constrangedor.

**E mudou outro:** `backend/.gitignore`. Ele tinha `*.jar`, que é razoável para
não versionar artefato de build, mas engolia junto o `gradle-wrapper.jar` - o
detalhe que derrubou a primeira execução (seção 6.1). Agora tem uma exceção:

```gitignore
*.jar
!gradle/wrapper/gradle-wrapper.jar
```

---

## 5. Como acompanhar

- **A execução:** aba **Actions** do repositório, ou `gh run watch` no terminal.
- **Num PR:** os quatro checks aparecem na parte de baixo da conversa; "Resultado
  dos testes" é o que resume.
- **Quando falha:** os artefatos ficam no rodapé da página da execução -
  `relatorio-unidade`, `relatorio-integracao`, `capturas-cypress` e
  `logs-sistema`.
- **Reproduzir na máquina:** os comandos do CI são os mesmos da seção 3.5 da
  parte 2. Não há comando que só exista dentro do pipeline.

### Tempo esperado por execução

Medido na primeira execução verde (08/09/2026, run 34179005650):

| Job | Tempo |
| --- | --- |
| Unidade | 50s |
| Integração | 1min18 |
| Sistema | 4min56 (dos quais 1min41 são os 50 testes; o resto é instalar, empacotar e compilar o Angular) |
| **Total até o check final** | **5min52** |

Integração e sistema rodam em paralelo, por isso o total é menor que a soma.

Repositório público, então os minutos do GitHub Actions não são cobrados.

---

## 6. O que o pipeline revelou até ficar verde

O pipeline não nasceu verde. Foram três falhas até a primeira execução completa,
e vale registrar todas: **nenhuma era erro de teste**. As três eram diferenças
entre a máquina de desenvolvimento e o runner - exatamente o tipo de coisa que
um CI existe para achar, e que nenhuma quantidade de "na minha máquina funciona"
teria encontrado.

### 6.1 O jar do wrapper do Gradle nunca tinha sido versionado

Primeira execução, e o primeiro job morreu em 16 segundos:

```
Error: Could not find or load main class org.gradle.wrapper.GradleWrapperMain
```

Os outros dois jobs foram pulados junto, porque dependem dele.

O `backend/.gitignore` tinha `*.jar` para não versionar artefato de build, e essa
regra pegava também o `backend/gradle/wrapper/gradle-wrapper.jar`. Na minha
máquina o arquivo existe desde que o projeto foi criado, então nunca fez falta;
no runner chega só o script `gradlew`, que manda a JVM executar uma classe que
está dentro do jar que não foi junto.

Esse jar tem 43 KB e é o único `.jar` que deve estar no repositório: é o que
garante que CI e desenvolvedores rodem a mesma versão do Gradle sem instalar
nada. Correção: a exceção no `.gitignore` da seção 4.

### 6.2 A suíte de sistema toda com ECONNREFUSED na 4201

Com o backend resolvido, unidade e integração passaram, e os 50 testes de
sistema falharam todos com a mesma mensagem:

```
CypressError: `cy.visit()` failed trying to load: http://localhost:4201/login
> Error: connect ECONNREFUSED 127.0.0.1:4201
```

O que confunde é que o passo anterior tinha declarado sucesso. Pelos horários do
log:

| Horário | O que aconteceu |
| --- | --- |
| 01:12:37 | passo de espera imprime "Frontend no ar depois de 20s." |
| 01:12:37 | passo do Cypress começa |
| 01:12:59 | primeira visita: `ECONNREFUSED` na 4201 |

**Primeira hipótese, errada.** Subir o servidor num passo e usá-lo em outro:
cada `run:` do Actions é um shell diferente, e processo em segundo plano vira
órfão quando aquele shell termina. Juntei subir, esperar e testar num passo só.

**O que derrubou a hipótese:** a execução seguinte falhou igual, com tudo no
mesmo passo. Se fosse orfandade, teria passado.

**A causa real.** Duas evidências apontaram para outro lado:

1. O `frontend.log` das duas execuções tinha **exatamente 2318 bytes**, byte a
   byte igual, terminando em `➜ Local: http://localhost:4201/`. Processo morto
   num instante qualquer não produz dois logs de tamanho idêntico. O servidor
   não estava morrendo: estava vivo e inalcançável.
2. A verificação usava `curl http://localhost:4201` e o Cypress usava
   `127.0.0.1:4201`. Parecem a mesma coisa, e não são.

O dev-server do Angular escuta, por padrão, no endereço em que `localhost`
resolver na máquina. Aqui isso é IPv4, porque o `/etc/hosts` desta máquina não
dá o nome `localhost` ao `::1`:

```
127.0.0.1 localhost
::1     ip6-localhost ip6-loopback
```

E, de fato, subindo o dev-server aqui numa porta de teste:

```
LISTEN  127.0.0.1:4299   users:(("node",...))
```

Nas imagens do runner o `localhost` também aponta para `::1`, e o servidor pode
acabar escutando só em `[::1]:4201`. Aí o `curl` sem `-4` tenta IPv6 primeiro,
conecta, e o passo anuncia "Frontend no ar" com toda a razão - enquanto o
Cypress, que conecta em `127.0.0.1`, encontra porta fechada. A verificação não
estava mentindo: estava medindo outra coisa.

Correções:

- `npx nx serve ... --host 0.0.0.0`, que força a escuta em todos os endereços
  IPv4. Verificado aqui: passa de `127.0.0.1:4299` para `0.0.0.0:4299`, e
  `curl -4 http://127.0.0.1:4299` responde.
- as esperas passaram a usar `curl -4` contra `127.0.0.1`, o mesmo endereço e a
  mesma pilha do Cypress;
- `CYPRESS_BASE_URL` e `CYPRESS_API_URL` passaram a apontar para `127.0.0.1`, o
  que tira a resolução de nome da jogada;
- e entrou a função `diagnostico` da seção 3.3, para que a próxima falha desse
  tipo apareça no log em vez de precisar ser deduzida.

A lição que fica é sobre o teste do CI, não sobre o código: **uma verificação de
prontidão só vale se falar exatamente o mesmo protocolo, endereço e porta que o
consumidor vai falar.** A que estava lá aprovava um servidor que o Cypress nunca
alcançaria.

A execução seguinte confirmou o diagnóstico - `ss` mostrando
`LISTEN 0.0.0.0:4201`, o Cypress alcançando a aplicação e um teste passando pela
primeira vez. Mas a última correção da lista, a de trocar `localhost` por
`127.0.0.1`, criou a falha da próxima seção.

### 6.3 A tela de login sem instituições, e um 403 escondido

Resolvido o ECONNREFUSED, o Cypress passou a alcançar a aplicação - um teste até
passou, o que era impossível antes. Mas 49 falharam, todos no mesmo ponto:

```
AssertionError: Timed out retrying after 12000ms:
Expected to find element: `mat-option`, but never found it.
```

A tela de login carregava e a lista de instituições vinha vazia.

O bloco de diagnóstico, dessa vez, tirou o chute da jogada. Ele chama a API por
duas rotas: direta em `127.0.0.1:8080` e pelo proxy `/api` do dev-server em
`127.0.0.1:4201`. Depois da falha, **as duas responderam 200 com a lista cheia**:

```
-- API direta em 127.0.0.1:8080 --
[{"id":1,"title":"Instituição E2E 1788833013575555",...}]
HTTP 200
-- API pelo proxy do dev-server, 127.0.0.1:4201 --
[{"id":1,"title":"Instituição E2E 1788833013575555",...}]
HTTP 200
```

Dados no banco, proxy funcionando, servidor de pé - e a tela vazia mesmo assim.
Quem fechou o caso foi a captura de tela do Cypress, no painel de comandos:

```
(xhr)  POST 403  /api/entity-tenant/list-all-tenants
```

O navegador levava **403** na mesma chamada que o `curl` fazia com sucesso. A
diferença entre os dois é um cabeçalho: o navegador manda `Origin`, o `curl`
não. E o backend libera uma origem só:

```kotlin
@Value("\${frontend.url:http://localhost:4201}")
private lateinit var frontendUrl: String
...
registry.addMapping("/**").allowedOrigins(frontendUrl)
```

A causa, então, foi a correção anterior. Ao apontar o Cypress para
`http://127.0.0.1:4201` (seção 6.2), o navegador passou a mandar esse `Origin`,
que não é `http://localhost:4201`, e o Spring recusou. Uma correção criou a
falha seguinte, e o diagnóstico que eu tinha escrito não a via porque media a
rota sem o cabeçalho que importava.

Correção: o backend passa a subir com a origem certa, usando a chave que a
própria aplicação já expõe.

```bash
java -jar "$jar" --spring.profiles.active=e2e --frontend.url=http://127.0.0.1:4201
```

Fica a lição, que vale mais que a correção: **`curl` não é navegador.** Uma
verificação de prontidão feita com `curl` aprova rotas que o navegador vai
recusar, porque ela não manda `Origin`, não guarda cookie e não passa por CORS.
Ela serve para dizer "o servidor respondeu", nunca "a aplicação funciona" - e
foi por isso que o spec de fumaça (seção 3.3, ponto 7) entrou no lugar dela como
primeiro sinal de vida real.

### 6.4 Estado atual: verde

Execução [34179005650](https://github.com/Gharantes/repo-tests/actions/runs/34179005650),
08/09/2026:

| Job | Resultado | Tempo |
| --- | --- | --- |
| Testes de unidade | 30/30 | 50s |
| Testes de integração | 70/70 | 1min18 |
| Testes de sistema | 50/50 | 4min56 |
| Resultado dos testes | passou | 2s |

```
✔  autenticacao.cy.ts    00:07     6     6
✔  detalhes.cy.ts        00:11     7     7
✔  eventos.cy.ts         00:20     9     9
✔  projetos.cy.ts        00:23    11    11
✔  tags.cy.ts            00:15     8     8
✔  usuarios.cy.ts        00:23     9     9
✔  All specs passed!     01:41    50    50
```

As 150 provas da parte 2 rodam agora a cada push e a cada pull request, numa
máquina que não é a minha, contra um PostgreSQL que nasce e morre dentro da
execução. O check **Resultado dos testes** está pronto para virar obrigatório na
proteção da `main`.

## 7. Limitações conhecidas

- **Push e PR na mesma branch disparam duas execuções.** Explicado na seção 1;
  aceito para não deixar branch sem CI.
- **O job de sistema usa o dev-server do Angular**, que é mais lento que servir o
  build pronto. Servir o build exigiria um proxy para `/api` em separado, já que
  o `serve-static` do Nx não usa o `proxy.conf.json`. Enquanto o job couber no
  tempo, o dev-server é o caminho que se parece mais com o do desenvolvedor.
- **O pipeline só testa; não faz deploy.** O deploy (Vercel + Supabase) é outra
  entrega da atividade e vai virar outro workflow, disparado só na `main` e só
  depois de o `resultado` passar.
- **Não há passo de lint.** O projeto tem ESLint configurado, mas a atividade
  pede um pipeline que rode os testes; incluir lint agora só adicionaria uma
  fonte de vermelho não relacionada à suíte.

---

## 8. Próximo passo (parte 4)

Com o pipeline no ar, a proteção da `main` tem o que exigir: em
**Settings → Branches → Add rule** para `main`, marcar exigência de pull request
e, em *Require status checks to pass before merging*, selecionar o check
**Resultado dos testes**. Isso é o conteúdo da parte 4 e está detalhado lá.
