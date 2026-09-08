# Pipeline de integração contínua: Synergia

**Disciplina:** DevOps, Aula 05, Projeto Integrador (Parte 3)
**Autor:** Guilherme Harmatiuk Arantes
**Versão:** 1.0
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
5. **`./gradlew bootJar -x test`** e `java -jar` em segundo plano, com o log
   redirecionado para arquivo e o PID guardado. Aqui o CI se afasta do
   procedimento manual de propósito: `bootRun` deixa o processo pendurado num
   daemon do Gradle, e o que o job precisa é de um processo cujo PID ele conheça,
   para poder derrubar no fim.
6. **`npx nx serve synergia-frontend --port 4201`**, também em segundo plano. É o
   dev-server mesmo, não o build de produção, porque é ele que aplica o
   `proxy.conf.json` que encaminha `/api` para o backend - o mesmo caminho que os
   testes percorrem na máquina de desenvolvimento.
7. **Espera ativa pelos dois**, com limite de 10 minutos cada:

   ```bash
   for i in $(seq 1 60); do
     if curl -fsS -X POST http://localhost:8080/api/entity-tenant/list-all-tenants > /dev/null; then
       exit 0
     fi
     sleep 10
   done
   ```

   A verificação do backend é uma chamada de verdade à API, que só responde
   depois que o Spring subiu *e* conectou no banco. Se estourar o tempo, o passo
   imprime as últimas 100 linhas do log antes de falhar, para que o motivo
   apareça na própria aba do job.
8. **`npm run e2e`** - os mesmos 50 testes, no mesmo navegador Electron.
9. **Artefatos**: capturas de tela do Cypress quando algum teste falha, e os logs
   do backend e do frontend sempre. Um teste de sistema que quebra no CI e não
   quebra na máquina local é impossível de investigar sem esses três arquivos.
10. **Derrubar os processos** com `if: always()`.

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

| Job | Estimativa |
| --- | --- |
| Unidade | ~1-2 min |
| Integração | ~3-5 min |
| Sistema | ~12-18 min (a suíte leva 5m26s local; o resto é instalar, empacotar e compilar o Angular) |
| **Total até o check final** | **~15-20 min** |

Repositório público, então os minutos do GitHub Actions não são cobrados.

---

## 6. O que foi verificado e o que depende do primeiro push

Sendo honesto sobre o que está confirmado neste momento:

**Verificado localmente, com os mesmos comandos que o pipeline usa:**

- `./gradlew unitTest --no-daemon` passa (30 testes).
- `./gradlew bootJar --no-daemon -x test` gera
  `backend/build/libs/synergia-0.0.1-SNAPSHOT.jar`.
- Esse `.jar`, rodado com `--spring.profiles.active=e2e` e as variáveis
  `E2E_DB_*` apontando para outro banco, sobe conectado ao banco indicado pela
  variável (`HikariPool ... synergia_e2e`) - ou seja, a mudança do arquivo de
  perfil funciona.
- O endereço usado como sinal de "backend no ar"
  (`POST /api/entity-tenant/list-all-tenants`) responde `200` com a lista.
- O YAML do workflow é válido.

**Só o primeiro push confirma:** o comportamento dos service containers, os
tempos reais de cada job e a presença das bibliotecas do Electron na imagem do
runner. Nada disso dá para simular fielmente na máquina local, e é justamente
por isso que o passo `npx cypress verify` está lá.

---

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
