Terminei a auditoria e o PDF está pronto. **O ponto principal: o backend não tem nenhuma autenticação.** O login confere a senha e devolve só IDs. Depois disso, o navegador manda o `id-tenant` e o `idAccount` que quiser, e o servidor confia. Por isso o filtro por tenant, que existe em todas as listagens, não isola nada. Isso vale para o deploy em `repo-tests.onrender.com`, e o repositório no GitHub é público.

Somando tudo, a conta `ADMIN` de qualquer instituição pode ser tomada em duas chamadas, sem nenhuma credencial:

1. `list-accounts-by-tenant` devolve os IDs e logins de qualquer tenant.
2. `POST /api/entity-account/update/{id}` com uma senha nova troca a senha da conta.

**Stack:** Kotlin + Spring Boot 3.5 (JPA + `NamedParameterJdbcTemplate`, Postgres), Angular 19/Nx, Dockerfile para o Render e GitHub Actions. Não há Spring Security, RLS, Helm nem Terraform. Li os 35 handlers dos 12 controllers.

**Resultado:** 24 achados (3 críticos, 9 altos, 4 médios, 5 baixos, 3 informativos) e 11 pontos fortes.

---

## Achados, arquivo por arquivo

> **Abreviações:** `…/synergia/` = `backend/src/main/kotlin/br/com/synergia/` e `…/resources/` = `backend/src/main/resources/`.

### Backend: controllers (`…/synergia/rest/`)

- **Todos os controllers:** nenhuma rota verifica quem está chamando (**C-01, crítica**). A causa começa em `backend/build.gradle.kts:39-52`, sem `spring-boot-starter-security`.
- **`EntityAccountResource.kt`**
  - `:16-26`: lista contas de qualquer tenant, com login e e-mail (**A-01, alta**).
  - `:27-35`: lista contas de um evento sem filtrar o tenant (**M-03, média**).
  - `:36-46`: confirma se um login ou e-mail existe (**B-01, baixa**).
  - `:55-63`: o update de conta troca a senha de qualquer ID (**C-03, crítica**).
- **`EntityEventResource.kt`:** `:15-24` lista por um tenant escolhido pelo cliente (**A-02, alta**). `:25-33` lista por conta sem filtro de tenant (**M-03**). `:51-59` atualiza sem checar posse (**A-06, alta**).
- **`EntityProjectResource.kt`:** `:15-24` (**A-02**), `:25-42` (**M-03**) e `:51-59` (**A-06**), com os mesmos padrões do arquivo anterior.
- **`EntityTagResource.kt`:** `:21-38` (**A-02**), `:39-56` (**M-03**) e `:65-73` (**A-06**).
- **`EntityTenantResource.kt`:** `:15-22` devolve todos os tenants, inclusive os privados (**M-01, média**). `:31-39` renomeia qualquer instituição (**A-07, alta**).
- **`EntityDeleteByIdResource.kt`:** `:15-22` apaga tags via `GET` e `:23-30` apaga contas, ambos sem checagem (**A-05, alta**).
- **`EntityGetByIdResource.kt:31-85`:** lê conta, evento, projeto e tag de qualquer tenant, incluindo os membros (**M-02, média**).
- **`ActionAttributePermissionsResource.kt:17-22`** e **`ActionManageRelationshipsResource.kt:16-36`:** não têm autorização, mas hoje não fazem nada, porque o SQL está vazio e os métodos não têm corpo. O risco é para quando forem implementados (**I-01, informativa**).

### Backend: serviços, DTOs e SQL

- **`…/resources/sql/page-login/check-login-information.sql:13-18`:** quando o cliente envia `checkLastSeen=true`, a senha não é comparada. Basta o usuário ter logado nas últimas 12 horas (**C-02, crítica**).
  - O teste `PageLoginIntegrationTest.kt:121-133` garante esse comportamento.
  - O mesmo arquivo, na linha `:18`, compara a senha em texto puro (**A-X1**).
- **`EntityAccountSqlService.kt:86-99`:** é onde o update de conta sobrescreve login, e-mail e senha (**C-03**). As linhas `:67-75` criam contas com o `idTenant` que vem do corpo da requisição (**A-04**).
- **`UpsertEventDto.kt:4-5`** e **`UpsertProjectDto.kt:4-5`**, usados em `EntityEventService.kt:30-33` e `EntityProjectService.kt:20-24`: o autor e o tenant vêm do corpo (**A-04, alta**).
- **Updates sem checagem de posse:**
  - `EntityEventSqlService.kt:102-109`, `EntityProjectSqlService.kt:91-97` e `EntityTagSqlService.kt:61-69` (**A-06**).
  - `EntityTenantSqlService.kt:43-49` (**A-07**).
- **`EntityTenantSqlService.kt:19-21`** usa `findAll()` e ignora `isPrivate` (**M-01**).
- **SQL sem filtro de tenant (M-03)**, todos em `…/resources/sql/`: `list-accounts-by-event.sql:10`, `list-accounts-by-project.sql:10`, `list-events-by-account.sql:11`, `list-projects-by-account.sql:11`, `list-tags-of-event.sql:11` e `list-tags-of-project.sql:11`.
- **`AuthPermissionsEnum.kt:8-20`:** as permissões estão definidas, mas o enum não é usado em nenhum lugar (**A-03**).
- **`Account.kt:30-31`** e **`EntityTenantSqlService.kt:37`:** senhas guardadas em texto puro (**A-X1, alta**, fora das cinco categorias).
- **`ResponseMessenger.kt:12-14,26-32`:** a mensagem de exceção vai para o cliente no header `x-error` (**B-X1, baixa**).
- **`build.gradle.kts:48-49`:** o Swagger fica ativo em produção (**I-03, informativa**).

### Frontend

- **`has-active-tenant.ts:14-22`**, **`session.service.ts:36-53`** e **`layout-sidebar.component.html:60-75`:** o único controle de acesso é um guard que lê o `localStorage`. O menu Administração aparece para todos os usuários (**A-03, alta**).
- **`route-login.component.ts:53-58`:** é daqui que sai o login com `password: ''` e `checkLastSeen: true` (**C-02**).
- **`connector-upsert-event.ts:17`** e **`connector-upsert-project.ts:15`:** o `idAccount` enviado vem da sessão local (**A-04**).
- **`safe-image.component.html:4`:** o `bannerUrl` aceita qualquer URL externa. Não há XSS, mas quem abre o card é rastreado (**B-04, baixa**).

### Segredos

- **`frontend/nx.json:20`:** token do Nx Cloud com escopo read-write, versionado desde 10/10/2024 num repositório público (**A-08, alta**).
- **Senha `MaybeLater` (M-04, média):**
  - `…/resources/application-datasource.yaml:4-5`, que é o perfil carregado por padrão.
  - Como valor padrão quando a variável falta: `application-e2e.yaml:14-15`, `build.gradle.kts:89-90` e `IntegrationTestBase.kt:44-45`.
  - Na documentação: `college/dev-ops/atv-01/response-02.md:185` e `response-03.md:257,265`.
  - Nada na inicialização recusa esses valores padrão.
- **`application-datasource-windows.yaml:4-5`:** usuário `postgres` com senha `admin` (**B-02, baixa**).
- **Histórico git:** `evoge_pass` no commit `0b79851` (branch `origin/chore/atualiza-dependencias`) e `password: Admin` em `87702be`/`8ce1026` (**B-03, baixa**).
- **`ci.yml:33-34,102-103,130-132,169-171`:** credenciais do Postgres temporário do CI. São aceitáveis e não viraram issue (**I-02**).

---

## O que está correto

- Todas as queries que recebem entrada usam parâmetros; não há SQL injection.
- O frontend não usa `innerHTML`, `bypassSecurityTrust` nem `eval`.
- O perfil de produção do Render não tem valores padrão para as credenciais.
- O bundle em `frontend/dist` não contém chaves.
- O CI usa `permissions: contents: read` e passa o título do PR por variável de ambiente, não direto no shell.
- O CORS libera uma única origem.

---

## Arquivos gerados

- **`relatorio-auditoria-seguranca.pdf`:** 20 páginas A4, com as 12 issues no final, prontas para colar no GitHub.
- **`achados.py`:** todos os dados do relatório. Para atualizar, edite este arquivo e rode o gerador de novo.
- **`gerar_relatorio.py`:** o script que monta o PDF.
- **`requirements.txt`** e **`.gitignore`**, que ignora o `.venv/` local onde ficam `reportlab` e `matplotlib`.

Rasterizei as páginas e corrigi três defeitos: chips de severidade quebrando em duas linhas, trechos de código saindo das células e cabeçalhos partidos na tabela do resumo. Os gráficos e as tabelas estão legíveis.

---

## O que fazer primeiro:

1. Revogar o token do Nx Cloud.
2. Remover o `checkLastSeen` do login.
3. Trocar a senha `MaybeLater` onde ela estiver em uso.
