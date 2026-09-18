# Testes automatizados: Synergia

**Disciplina:** DevOps, Aula 05, Projeto Integrador (Parte 2)
**Autor:** Guilherme Harmatiuk Arantes
**Data:** 07/09/2026

---

## 1. O que foi entregue

Três camadas de teste sobre o código do Synergia:

| Camada | Onde fica | Testes | Precisa de |
| --- | --- | --- | --- |
| Unidade | `backend/src/test/kotlin/br/com/synergia/unit/` | 30 | JDK |
| Integração | `backend/src/test/kotlin/br/com/synergia/integration/` | 70 | + PostgreSQL |
| Sistema (end-to-end) | `frontend/cypress/e2e/` | 50 | + backend e frontend no ar |
| **Total** | | **150** | |

Nenhum teste usa mock: as camadas de integração e sistema gravam e leem de um
PostgreSQL real.

- **Unidade:** lógica pura, sem banco nem rede. Extensões de String usadas na
  busca, enums, conversão entidade → DTO (incluindo a senha não sair no JSON) e
  a existência de todo arquivo `.sql` referenciado pelo código.
- **Integração:** sobe a aplicação inteira e chama os endpoints por HTTP. Cobre
  login, projetos, eventos, contas, tags, instituições (tenants) e a tela de
  detalhes, incluindo busca, filtros por tag e isolamento entre instituições.
- **Sistema:** Cypress num navegador real, navegando pelo menu como um usuário.
  Cobre autenticação, projetos, eventos, tags, usuários e telas de detalhes.

---

## 2. Pré-requisitos

- JDK 21
- Node 20 e npm, com `cd frontend && npm ci` já executado
- PostgreSQL em `localhost:5432`

Os testes usam bancos próprios, separados do `synergia_dev`. Crie-os uma vez:

```bash
psql -h localhost -U raindrop -d postgres \
  -c "CREATE DATABASE synergia_test OWNER raindrop;" \
  -c "CREATE DATABASE synergia_e2e OWNER raindrop;"
```

As tabelas são criadas pelo Hibernate na primeira execução.

---

## 3. Como executar

### Unidade e integração

```bash
cd backend
./gradlew unitTest          # só unidade
./gradlew integrationTest   # só integração (precisa do PostgreSQL)
./gradlew test              # as duas
```

O banco da integração pode ser trocado por variáveis de ambiente
(`TEST_DB_URL`, `TEST_DB_USERNAME`, `TEST_DB_PASSWORD`).

### Sistema

Precisa da aplicação no ar, em três terminais:

```bash
# Terminal 1: backend usando o banco synergia_e2e
cd backend
./gradlew bootRun --args='--spring.profiles.active=e2e'

# Terminal 2: frontend
cd frontend
npx nx serve synergia-frontend --port 4201

# Terminal 3: Cypress
cd frontend
npm run e2e         # headless
npm run e2e:open    # com a janela do Cypress
```

Se o Cypress falhar logo no início com `bad option: --no-sandbox`, rode
`env -u ELECTRON_RUN_AS_NODE npm run e2e` (a variável vem do terminal do VS Code).

### Relatórios

- `backend/build/reports/tests/unitTest/index.html`
- `backend/build/reports/tests/integrationTest/index.html`
- Capturas de tela das falhas do Cypress: `frontend/cypress/screenshots/`

---

## 4. Resultado

```
$ ./gradlew clean unitTest integrationTest
Resultado: SUCCESS (30 testes, 30 passaram, 0 falharam, 0 pulados)
Resultado: SUCCESS (70 testes, 70 passaram, 0 falharam, 0 pulados)

$ npm run e2e
  ✔  autenticacao.cy.ts    6    6
  ✔  detalhes.cy.ts        7    7
  ✔  eventos.cy.ts         9    9
  ✔  projetos.cy.ts       11   11
  ✔  tags.cy.ts            8    8
  ✔  usuarios.cy.ts        9    9
  ✔  All specs passed!    50   50
```
