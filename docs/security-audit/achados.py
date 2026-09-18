# -*- coding: utf-8 -*-
"""Dados da auditoria de segurança do Synergia.

Este arquivo é a fonte única dos achados, pontos fortes, recomendações e
issues. O gerador (gerar_relatorio.py) só formata o que está aqui; para
atualizar o relatório, edite este arquivo e rode o gerador de novo.
"""

PROJETO = "Synergia"
DATA = "18/09/2026"
COMMIT = "1e166f9 (branch teste/protecao)"
REPO = "github.com/Gharantes/repo-tests (público)"

ESCOPO = [
    "Backend Kotlin/Spring Boot: os 12 controllers em backend/src/main/kotlin/br/com/synergia/rest "
    "(35 handlers, todos lidos), serviços, DTOs, entidades JPA, os 17 arquivos .sql e os perfis application-*.yaml.",
    "Frontend Angular 19/Nx: rotas, guard, SessionService, todos os templates .html (busca por sinks de HTML/URL) "
    "e o bundle já compilado em frontend/dist.",
    "Deploy e automação: backend/Dockerfile, .github/workflows/ci.yml, backend/build.gradle.kts, frontend/nx.json, "
    "configurações de IDE versionadas (.idea, db/.idea).",
    "Documentação (docs/, college/, READMEs) e todo o histórico git (203 commits, todas as branches) "
    "atrás de segredos commitados.",
]

STACK = [
    ("Linguagem / framework", "Kotlin 1.9 + Spring Boot 3.5 (spring-boot-starter-web), JDK 21"),
    ("Acesso a dados", "Spring Data JPA (repositórios) + NamedParameterJdbcTemplate com SQL em arquivos .sql; PostgreSQL"),
    ("Autenticação", "Nenhuma no servidor: sem Spring Security, sem sessão, sem token. O login devolve só IDs, "
                     "que o frontend guarda no localStorage e reenvia como parâmetros"),
    ("Isolamento de tenant", "Filtro manual por id_tenant nas queries, com o valor vindo do próprio cliente "
                             "(query string ou corpo). Não há RLS nem middleware de tenant"),
    ("Frontend", "Angular 19 standalone (Nx), cliente gerado por OpenAPI Generator; sem lib de sanitização extra"),
    ("Deploy / CI", "Dockerfile multi-stage (Render, perfil datasource-render), GitHub Actions com Postgres efêmero; "
                    "sem Helm/Terraform/docker-compose"),
]

METODOLOGIA = [
    ("1. Banco sem tranca",
     "Sem Supabase/RLS. O mecanismo de isolamento é o filtro WHERE id_tenant = :id_tenant. Foi verificado de onde vem "
     "esse valor (servidor ou cliente) em cada listagem, e se as queries por relacionamento também filtram por tenant."),
    ("2. Permissão no navegador",
     "Mapeados todos os gates do Angular (guard HasActiveTenant, menu Administração, SessionService) e cruzados com "
     "os endpoints correspondentes. Procurado qualquer uso do enum AuthPermissionsEnum no backend."),
    ("3. IDOR",
     "Percorridos os 35 handlers dos 12 controllers. Para cada ID recebido (path, query ou body) foi verificado se "
     "há checagem de posse/tenant antes do findById/save/deleteById."),
    ("4. Chaves expostas",
     "Busca por padrões de segredo em todos os arquivos versionados, nos perfis Spring (incluindo defaults ${VAR:valor}), "
     "no CI, nos scripts, na documentação, em git log -p de todas as branches e no bundle compilado em frontend/dist."),
    ("5. XSS",
     "Busca por innerHTML, bypassSecurityTrust*, DomSanitizer, eval/new Function, [href]/[src]/[style] com dado do "
     "usuário e markdown. No backend: respostas HTML, e-mails e templates (não existem; a API só devolve JSON)."),
]

CATEGORIAS = {
    1: "Banco sem tranca",
    2: "Permissão no navegador",
    3: "IDOR",
    4: "Chaves expostas",
    5: "XSS",
    6: "Adicionais",
}

# sev: critica | alta | media | baixa | info
ACHADOS = [
    # ------------------------------------------------------------------ Cat. 1
    dict(id="C-01", cat=1, sev="critica",
         titulo="Backend sem autenticação: os 35 endpoints aceitam chamadas anônimas",
         locais=["backend/build.gradle.kts:39-52", "backend/src/main/kotlin/br/com/synergia/SynergiaApplication.kt:8-14",
                 "backend/src/main/kotlin/br/com/synergia/config/CorsConfig.kt:13-18",
                 "backend/src/main/kotlin/br/com/synergia/rest/*.kt (todos)"],
         trecho='dependencies { ... "spring-boot-starter-web" ... }   // sem spring-boot-starter-security\n'
                '@RequestParam("id-tenant") idTenant: Long             // tenant vem do cliente',
         desc="Não há Spring Security, filtro, interceptor nem token. O servidor não sabe quem está chamando, então o "
              "filtro por tenant usa o id-tenant que o próprio chamador envia. O CORS restringe só navegadores; curl, "
              "scripts e o Swagger ignoram CORS. É a causa raiz de quase todos os demais achados.",
         explor="Qualquer pessoa na internet alcança https://repo-tests.onrender.com/api/... sem credencial."),
    dict(id="A-01", cat=1, sev="alta",
         titulo="Listagem de contas de qualquer tenant, com login e e-mail",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/EntityAccountResource.kt:16-26",
                 "backend/src/main/resources/sql/page-list-accounts/list-accounts.sql:9"],
         trecho='@PostMapping("/list-accounts-by-tenant")\n'
                'fun listAccountsByTenant(@RequestParam("id-tenant") idTenant: Long, ...)\n'
                'WHERE a.id_tenant = :id_tenant',
         desc="O id-tenant é escolhido pelo chamador. Iterando 1..N obtém-se login, nome e e-mail de todos os usuários "
              "de todas as instituições. Os logins alimentam diretamente o bypass de senha (C-02).",
         explor="Nenhuma condição: basta um POST sem corpo."),
    dict(id="A-02", cat=1, sev="alta",
         titulo="Eventos, projetos e tags listados por id-tenant arbitrário",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/EntityEventResource.kt:15-24",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityProjectResource.kt:15-24",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityTagResource.kt:21-38",
                 "backend/src/main/resources/sql/entity-event/list-events-by-tenant.sql:10",
                 "backend/src/main/resources/sql/entity-project/list-projects-by-tenant.sql:10",
                 "backend/src/main/resources/sql/page-list-tags/list-tags.sql:11"],
         trecho='@RequestParam("id-tenant") idTenant: Long\n'
                'WHERE e.id_tenant = :id_tenant   /  p.id_tenant = :id_tenant  /  id_tenant = :id_tenant',
         desc="Mesmo padrão de A-01: o filtro existe, mas o valor é controlado pelo cliente, então não isola nada. "
              "Conteúdo de instituições privadas (is_private = true) fica legível.",
         explor="Nenhuma condição."),
    dict(id="M-01", cat=1, sev="media",
         titulo="list-all-tenants devolve todas as instituições, inclusive as privadas",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/EntityTenantResource.kt:15-22",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityTenant/services/EntityTenantSqlService.kt:19-21"],
         trecho='fun listAllTenants(text: String?): List<TenantDto> {\n'
                '    return tenantRepository.findAll().map { it.toDto() }   // ignora text e isPrivate',
         desc="A flag is_private não é considerada. O endpoint entrega o mapa de IDs de tenant que alimenta A-01/A-02 "
              "e C-02 (o login precisa do idTenant).",
         explor="Nenhuma condição; o próprio CI chama esse endpoint sem credencial (ci.yml:264)."),
    dict(id="B-01", cat=1, sev="baixa",
         titulo="Oráculo de existência de login/e-mail por tenant",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/EntityAccountResource.kt:36-46",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityAccount/services/EntityAccountService.kt:20-30"],
         trecho='@GetMapping("get-account-by-login-or-email")  ->  Boolean',
         desc="Responde true/false para qualquer login ou e-mail em qualquer tenant. Permite confirmar se um e-mail "
              "é cliente da plataforma. Impacto menor porque A-01 já vaza a lista inteira.",
         explor="Nenhuma condição."),
    # ------------------------------------------------------------------ Cat. 2
    dict(id="C-02", cat=2, sev="critica",
         titulo="Login sem senha: o cliente liga checkLastSeen e o SQL deixa de comparar a senha",
         locais=["backend/src/main/resources/sql/page-login/check-login-information.sql:10-18",
                 "backend/src/main/kotlin/br/com/synergia/libs/pageLogin/models/LoginInformationInputDto.kt:7",
                 "frontend/src/app/modules/page-login/route-login.component.ts:53-58",
                 "backend/src/test/kotlin/br/com/synergia/integration/PageLoginIntegrationTest.kt:121-133"],
         trecho="CASE WHEN :check_last_seen THEN (a.last_seen IS NOT NULL AND\n"
                "     ((now() - a.last_seen) < interval '12 hours'))\n"
                "ELSE a.password = :password END",
         desc="A decisão de exigir ou não a senha é tomada por um booleano enviado pelo navegador. Com idTenant e "
              "login (ambos públicos via M-01 e A-01), qualquer um entra como qualquer usuário que tenha logado nas "
              "últimas 12 horas, inclusive o ADMIN. O teste de integração consagra o comportamento "
              "(\"sessao recente é aceita ... mesmo sem senha\").",
         explor="Vítima com last_seen < 12h. Cada login bem-sucedido do atacante renova o last_seen, então a janela "
                "se estende indefinidamente."),
    dict(id="A-03", cat=2, sev="alta",
         titulo="Controle de acesso existe só no navegador (guard, localStorage e menu Administração)",
         locais=["frontend/src/app/security/routing/has-active-tenant.ts:14-22",
                 "frontend/src/libs/services/src/lib/session.service.ts:36-53",
                 "frontend/src/app/layout/component-layout-sidebar/layout-sidebar.component.html:60-75",
                 "backend/src/main/kotlin/br/com/synergia/libs/utilsCommons/enums/AuthPermissionsEnum.kt:8-20"],
         trecho="if (this.sessionService.getTenantId()) { return true; }\n"
                "localStorage.setItem('login-data', loginData);   // {tenant:{id}, user:{id}}",
         desc="O único gate é o guard HasActiveTenant, que olha um signal preenchido a partir do localStorage. Não "
              "existe papel (isAdmin/canEdit) na UI: o menu Administração (Usuários, Tags, Permissões) aparece para "
              "todo usuário, e o backend não confere papel em nenhuma rota. O enum AuthPermissionsEnum (CREATE_USER, "
              "EDIT_EVENT_AS_NON_MEMBER, ...) não é referenciado em nenhum lugar do backend.",
         explor="Qualquer usuário logado executa ações administrativas; editar login-data no localStorage troca de identidade."),
    dict(id="A-04", cat=2, sev="alta",
         titulo="Autor e tenant de novos registros definidos pelo corpo da requisição",
         locais=["backend/src/main/kotlin/br/com/synergia/libs/entityEvent/models/UpsertEventDto.kt:4-5",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityProject/models/UpsertProjectDto.kt:4-5",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityEvent/services/EntityEventService.kt:30-33",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityProject/services/EntityProjectService.kt:20-24",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityAccount/services/EntityAccountSqlService.kt:67-75",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityTag/services/EntityTagSqlService.kt:51-60",
                 "frontend/src/app/modules/page-upsert-event/connector/connector-upsert-event.ts:17",
                 "frontend/src/app/modules/page-upsert-project/connector/connector-upsert-project.ts:15"],
         trecho='val idTenant: Long, val idAccount: Long, ...          // UpsertEventDto / UpsertProjectDto\n'
                'createEventAccountRelationship(idEvent, params.idAccount, membershipLabel = "Organizador")',
         desc="O frontend preenche idAccount com o usuário da sessão local e o backend confia. Um chamador cria "
              "contas, tags, eventos e projetos dentro de outra instituição e nomeia qualquer conta como "
              "Organizador/Líder. As tags associadas também não são validadas contra o tenant.",
         explor="Nenhuma condição além de C-01."),
    # ------------------------------------------------------------------ Cat. 3
    dict(id="C-03", cat=3, sev="critica",
         titulo="IDOR em update de conta: troca a senha do ADMIN de qualquer instituição",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/EntityAccountResource.kt:55-63",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityAccount/services/EntityAccountSqlService.kt:86-99",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityAccount/services/EntityAccountService.kt:38-42"],
         trecho='accountRepository.findById(idAccount).ifPresent { account ->\n'
                '    account.login = params.login ...\n'
                '    if (!params.password.isNullOrBlank()) { account.password = params.password }',
         desc="Carrega a conta pelo ID do path e sobrescreve login, e-mail, nome e senha sem verificar quem pede nem "
              "se a conta pertence ao tenant. O idTenant do corpo é ignorado. Resultado: tomada de conta total de "
              "qualquer usuário, inclusive o ADMIN criado com cada instituição.",
         explor="IDs sequenciais (IDENTITY); os IDs vêm prontos de A-01."),
    dict(id="A-05", cat=3, sev="alta",
         titulo="Exclusão de contas e tags por ID sem checagem (tag via GET)",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/EntityDeleteByIdResource.kt:15-22",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityDeleteByIdResource.kt:23-30"],
         trecho='@GetMapping("delete-tag-by-id/{id-tag}")  ->  tagRepository.deleteById(idTag)\n'
                '@DeleteMapping("/delete-account/{id-account}")  ->  accountRepository.deleteById(idAccount)',
         desc="Apaga qualquer conta ou tag da base. A exclusão de tag é um GET, que pode ser disparado até por uma "
              "tag <img> ou por pré-carregamento de links.",
         explor="Nenhuma condição; varredura de IDs apaga a base inteira."),
    dict(id="A-06", cat=3, sev="alta",
         titulo="Update de evento, projeto e tag sem verificação de posse",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/EntityEventResource.kt:51-59",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityEvent/services/EntityEventSqlService.kt:102-109",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityProjectResource.kt:51-59",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityProject/services/EntityProjectSqlService.kt:91-97",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityTagResource.kt:65-73",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityTag/services/EntityTagSqlService.kt:61-69"],
         trecho='eventRepository.findById(idEvent).ifPresent { event -> event.title = params.title ... }\n'
                'val project = projectRepository.findById(idProject).orElseThrow()',
         desc="Nenhuma checagem de membro/organizador nem de tenant. As permissões EDIT_*_AS_NON_MEMBER existem "
              "no enum mas não são aplicadas. Permite pichação de conteúdo e troca de bannerUrl por imagem do atacante.",
         explor="Nenhuma condição."),
    dict(id="A-07", cat=3, sev="alta",
         titulo="Update de tenant sem checagem: renomeia qualquer instituição",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/EntityTenantResource.kt:31-39",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityTenant/services/EntityTenantSqlService.kt:43-49"],
         trecho='tenantRepository.findById(idTenant).ifPresent { tenant ->\n'
                '    tenant.title = params.title; tenant.identifier = params.identifier',
         desc="Altera título e identifier (chave única exibida no login) de qualquer instituição. Serve para phishing "
              "(\"FAG\" vira \"FAG - novo login\") ou para bloquear o cadastro de um identifier legítimo.",
         explor="Nenhuma condição."),
    dict(id="M-02", cat=3, sev="media",
         titulo="Leitura por ID de conta, evento, projeto e tag de qualquer tenant",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/EntityGetByIdResource.kt:31-43",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityGetByIdResource.kt:44-60",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityGetByIdResource.kt:61-77",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityGetByIdResource.kt:78-85"],
         trecho='val el = accountRepository.findById(idAccount).orElse(null)?.toDto()',
         desc="findById direto do path. Com lookup-members=true o evento/projeto vem com a lista de membros "
              "(login e e-mail).",
         explor="Nenhuma condição."),
    dict(id="M-03", cat=3, sev="media",
         titulo="Listagens por relacionamento sem filtro de tenant",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/EntityAccountResource.kt:27-35",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityEventResource.kt:25-33",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityProjectResource.kt:25-42",
                 "backend/src/main/kotlin/br/com/synergia/rest/EntityTagResource.kt:39-56",
                 "backend/src/main/resources/sql/entity-account/list-accounts-by-event.sql:10",
                 "backend/src/main/resources/sql/entity-account/list-accounts-by-project.sql:10",
                 "backend/src/main/resources/sql/entity-event/list-events-by-account.sql:11",
                 "backend/src/main/resources/sql/entity-project/list-projects-by-account.sql:11",
                 "backend/src/main/resources/sql/page-extended-event/list-tags-of-event.sql:11",
                 "backend/src/main/resources/sql/page-extended-project/list-tags-of-project.sql:11"],
         trecho='WHERE ear.id_event = :id_event          -- nenhum a.id_tenant = ...',
         desc="As queries por evento/projeto/conta filtram só pelo ID do relacionamento. Revela membros, e-mails e "
              "participação de qualquer conta em qualquer instituição.",
         explor="Nenhuma condição."),
    dict(id="I-01", cat=3, sev="info",
         titulo="Endpoints de permissões e relacionamentos sem autorização (hoje inertes)",
         locais=["backend/src/main/kotlin/br/com/synergia/rest/ActionAttributePermissionsResource.kt:17-22",
                 "backend/src/main/resources/sql/action-attribute-permissions/attribute-permissions.sql (0 bytes)",
                 "backend/src/main/kotlin/br/com/synergia/rest/ActionManageRelationshipsResource.kt:16-36",
                 "backend/src/main/kotlin/br/com/synergia/libs/actionManageRelationships/services/ActionManageRelationshipsSqlService.kt:10-27"],
         trecho='fun attributePermissions(@RequestBody params: AttributePermissionsDto)   // sem checagem de papel',
         desc="Hoje não são exploráveis: o SQL de atribuição de permissões está vazio (a chamada falha) e os métodos "
              "de relacionamento não têm corpo. Assim que forem implementados sem autorização, o primeiro vira "
              "escalada de privilégio direta (qualquer um se dá qualquer permissão).",
         explor="Latente: depende de os métodos serem implementados."),
    # ------------------------------------------------------------------ Cat. 4
    dict(id="A-08", cat=4, sev="alta",
         titulo="Token do Nx Cloud com escopo read-write versionado em repositório público",
         locais=["frontend/nx.json:20"],
         trecho='"nxCloudAccessToken": "YTlmM2RlNjgt...fHJlYWQtd3JpdGU="\n'
                '# base64 -> a9f3de68-c3c5-4e66-af91-acc03116ab03|read-write',
         desc="Presente desde o commit inicial 5b929f2 (10/10/2024). Com escrita no cache remoto, um terceiro pode "
              "publicar artefatos de build envenenados que builds futuros reutilizam como cache hit.",
         explor="Repositório público no GitHub; o token precisa estar ativo no Nx Cloud."),
    dict(id="M-04", cat=4, sev="media",
         titulo="Credenciais de banco no perfil padrão e como fallback ${VAR:MaybeLater}, sem validação de startup",
         locais=["backend/src/main/resources/application-datasource.yaml:4-5",
                 "backend/src/main/resources/application.yaml:8",
                 "backend/src/main/resources/application-e2e.yaml:14-15",
                 "backend/build.gradle.kts:89-90",
                 "backend/src/test/kotlin/br/com/synergia/integration/support/IntegrationTestBase.kt:44-45",
                 "college/dev-ops/atv-01/response-02.md:185",
                 "college/dev-ops/atv-01/response-03.md:257,265"],
         trecho='username: raindrop\npassword: MaybeLater                          # perfil importado por padrão\n'
                'password: ${E2E_DB_PASSWORD:MaybeLater}',
         desc="O perfil importado por padrão (application.yaml:8) já traz usuário e senha reais da máquina de "
              "desenvolvimento, e os perfis de teste caem no mesmo valor quando a variável falta. Não há checagem "
              "na inicialização que recuse esses valores; um jar subido sem as variáveis conecta silenciosamente "
              "com eles. A senha está publicada no GitHub e repetida na documentação.",
         explor="Postgres acessível com essa senha, ou reuso da senha em outros serviços."),
    dict(id="B-02", cat=4, sev="baixa",
         titulo="Credencial padrão postgres/admin no perfil Windows",
         locais=["backend/src/main/resources/application-datasource-windows.yaml:4-5"],
         trecho='username: postgres\npassword: admin',
         desc="Credencial de superusuário padrão. Baixa porque o perfil está comentado em application.yaml:9, mas "
              "incentiva manter o Postgres local com senha trivial.",
         explor="Só se o perfil for ativado e o banco estiver exposto."),
    dict(id="B-03", cat=4, sev="baixa",
         titulo="Senhas de banco no histórico git",
         locais=["commit 0b79851 - backend/src/main/resources/application-evoge.yaml:5 (branch origin/chore/atualiza-dependencias)",
                 "commits 87702be / 8ce1026 - application-datasource.yaml (password: Admin)"],
         trecho='username: evoge_user\npassword: evoge_pass',
         desc="O arquivo application-evoge.yaml não está na branch atual, mas continua no remoto público. Apagar o "
              "arquivo não remove o segredo; ele precisa ser tratado como vazado.",
         explor="Reuso da senha em algum banco acessível."),
    dict(id="I-02", cat=4, sev="info",
         titulo="Credenciais do Postgres efêmero do CI em texto claro",
         locais=[".github/workflows/ci.yml:33-34", ".github/workflows/ci.yml:102-103",
                 ".github/workflows/ci.yml:130-132", ".github/workflows/ci.yml:169-171"],
         trecho='POSTGRES_USER: synergia\nPOSTGRES_PASSWORD: synergia',
         desc="Aceitável: o banco nasce e morre dentro do job e não é acessível de fora. Registrado só para "
              "cobertura; não gera issue.",
         explor="Não explorável."),
    # ------------------------------------------------------------------ Cat. 5
    dict(id="B-04", cat=5, sev="baixa",
         titulo="bannerUrl aceita qualquer URL externa (sem XSS, mas rastreia quem visualiza)",
         locais=["backend/src/main/kotlin/br/com/synergia/libs/entityEvent/services/EntityEventSqlService.kt:75,106",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityProject/services/EntityProjectSqlService.kt:72,95",
                 "frontend/src/libs/components/src/lib/safe-image/safe-image.component.html:4"],
         trecho='<img class="banner-img" [src]="url" (error)="errorOnLoad()" />',
         desc="O Angular sanitiza [src] (javascript: vira unsafe:) e <img> não executa script, então não há XSS. "
              "Mas qualquer URL http(s) é aceita e salva: quem abre o card faz uma requisição ao servidor do "
              "atacante (IP, User-Agent, horário). Combinado com A-06, dá para trocar o banner de eventos alheios.",
         explor="Requer criar ou editar um evento/projeto (trivial por C-01)."),
    # ------------------------------------------------------------------ Adicionais
    dict(id="A-X1", cat=6, sev="alta",
         titulo="Senhas armazenadas e comparadas em texto puro",
         locais=["backend/src/main/kotlin/br/com/synergia/libs/utilsEntities/jpa/account/Account.kt:30-31",
                 "backend/src/main/resources/sql/page-login/check-login-information.sql:18",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityAccount/services/EntityAccountSqlService.kt:73,95",
                 "backend/src/main/kotlin/br/com/synergia/libs/entityTenant/services/EntityTenantSqlService.kt:37"],
         trecho='ELSE a.password = :password END',
         desc="Fora das cinco categorias, mas relevante: não há hash (bcrypt/argon2). Qualquer vazamento do banco "
              "(ou do backup) expõe as senhas de todos os usuários, que costumam ser reutilizadas.",
         explor="Acesso de leitura ao banco."),
    dict(id="B-X1", cat=6, sev="baixa",
         titulo="Mensagem de exceção devolvida ao cliente no header x-error",
         locais=["backend/src/main/kotlin/br/com/synergia/libs/utilsCommons/objects/ResponseMessenger.kt:12-14",
                 "backend/src/main/kotlin/br/com/synergia/libs/utilsCommons/objects/ResponseMessenger.kt:26-32"],
         trecho='headers.set("x-error", sanitizedMessage)   // e.message cru, até 8 KB',
         desc="Erros de JPA/JDBC/Postgres chegam ao cliente com nomes de tabelas, colunas e constraints, o que "
              "facilita mapear o esquema.",
         explor="Provocar qualquer erro (ID inexistente, constraint)."),
    dict(id="I-03", cat=6, sev="info",
         titulo="Swagger UI e /v3/api-docs publicados em produção",
         locais=["backend/build.gradle.kts:48-49", "backend/src/main/resources/application-springdoc.yaml:1-11"],
         trecho='implementation("org.springdoc:springdoc-openapi-starter-webmvc-ui:2.5.0")',
         desc="Com a API sem autenticação, a documentação interativa vira o console do atacante. Não é falha por si, "
              "mas deveria ficar desligada fora de desenvolvimento.",
         explor="Sempre ativo (nenhuma propriedade springdoc.*.enabled=false)."),
]

PONTOS_FORTES = [
    (1, "SQL sempre parametrizado", "Todas as queries .sql que recebem entrada usam parâmetros nomeados do "
        "NamedParameterJdbcTemplate (ex.: list-accounts.sql:9-10). O único replace de texto "
        "(ActionAttributePermissionsSqlService.kt:15-16) concatena List<Long> já tipada pelo Jackson; não há SQL injection."),
    (1, "Login restrito ao tenant", "check-login-information.sql:11 filtra a.id_tenant e a resposta "
        "(LoginInformationResponseDto) não inclui a senha; AccountDto também não, o que os testes de integração conferem."),
    (1, "Filtros de tenant presentes nas listagens", "list-*-by-tenant.sql e list-tags.sql já têm WHERE id_tenant; "
        "a correção é trocar a origem do valor (sessão em vez de parâmetro), não reescrever as queries."),
    (4, "Perfil de produção sem segredos", "application-datasource-render.yaml:3-5,12 usa ${DATABASE_URL}, "
        "${DATABASE_USERNAME}, ${DATABASE_PASSWORD} e ${FRONTEND_URL} sem valor padrão: sem a variável, a aplicação não sobe."),
    (4, "Bundle do frontend limpo", "Varredura de frontend/dist e dos environment*.ts: só a URL pública da API "
        "(environment.prod.ts:2). Nenhuma chave, token ou JWT embutido."),
    (4, "CI com privilégio mínimo", "ci.yml:25-26 fixa permissions: contents: read; não há secrets.* no workflow; "
        "o Dockerfile não copia arquivos de configuração locais além de src/."),
    (4, "CI sem injeção de script", "ci.yml:63-68 passa o título do PR por env: e usa grep -qF em vez de interpolar "
        "${{ github.event.pull_request.title }} dentro do shell."),
    (5, "Templates Angular só com interpolação", "Nenhum innerHTML, outerHTML, bypassSecurityTrust*, DomSanitizer, "
        "eval ou new Function em frontend/src. Títulos e descrições entram por {{ }}, escapados pelo Angular."),
    (5, "URLs e estilos passam pelo sanitizador do Angular", "safe-image.component.html:4 usa [src], sanitizado; "
        "[style] na linha 11 recebe bannerColor gerado no servidor (ColorsEnum.randomHex), não texto do usuário."),
    (5, "Backend não gera HTML", "A API só responde JSON; não há envio de e-mail, Thymeleaf ou templates. "
        "O header x-error remove CR/LF (ResponseMessenger.kt:27), o que evita injeção de cabeçalho."),
    (2, "CORS com origem única", "CorsConfig.kt:14-17 libera uma origem configurável, sem curinga e sem "
        "allowCredentials. Não substitui autenticação, mas não abre a API para qualquer site via navegador."),
]

RECOMENDACOES = [
    ("P1", "Imediato (dias)", [
        "Revogar o nxCloudAccessToken no Nx Cloud e passar a injetá-lo por NX_CLOUD_ACCESS_TOKEN (A-08).",
        "Remover o ramo checkLastSeen do login; \"continuar logado\" deve usar um token/refresh emitido pelo servidor (C-02).",
        "Enquanto não há autenticação, tirar do ar ou proteger (Basic Auth no proxy do Render) as rotas de update/delete (C-03, A-05, A-07).",
        "Trocar a senha MaybeLater em todo lugar onde ela for usada e tratar evoge_pass e Admin como vazadas (M-04, B-03).",
    ]),
    ("P2", "Curto prazo (sprint)", [
        "Adicionar spring-boot-starter-security com sessão ou JWT assinado; o login passa a emitir o token e nenhuma rota fica anônima além de login, cadastro de tenant e listagem pública (C-01).",
        "Derivar idTenant e idAccount do principal autenticado em todos os controllers e remover esses campos dos DTOs (A-01, A-02, A-04).",
        "Verificar posse/tenant antes de todo findById/save/deleteById, de preferência num helper único que faça findByIdAndIdTenant (A-06, M-02, M-03).",
        "Aplicar AuthPermissionsEnum no servidor (@PreAuthorize ou checagem explícita) e só então exibir o menu Administração por papel (A-03, I-01).",
        "Armazenar senhas com BCryptPasswordEncoder e migrar as existentes (A-X1).",
    ]),
    ("P3", "Médio prazo", [
        "Filtrar is_private em list-all-tenants e devolver só o necessário para o login (M-01).",
        "Validar bannerUrl (só https, domínios permitidos) ou migrar para upload próprio (B-04).",
        "Trocar a exclusão de tag para DELETE e responder erros com mensagem genérica + ID de correlação no log (A-05, B-X1).",
        "Desligar springdoc fora de desenvolvimento e adicionar validação de startup que recuse credenciais padrão (I-03, M-04).",
        "Considerar RLS no Postgres (SET app.tenant_id por requisição) como segunda barreira ao filtro da aplicação.",
    ]),
]

# --------------------------------------------------------------------------- Issues
ISSUES = [
dict(titulo="[Segurança] Backend sem autenticação: todos os endpoints aceitam chamadas anônimas",
     labels=["security", "severity:critical"],
     corpo="""## Descrição
O backend não tem Spring Security, filtro, interceptor nem token. Nenhum dos 35 handlers sabe quem está chamando. O `id-tenant` e o `idAccount` usados para filtrar e para atribuir autoria vêm do próprio cliente, e o único controle de acesso é o guard `HasActiveTenant` do Angular, que lê o `localStorage`.

É explorável porque qualquer cliente HTTP (curl, script, Swagger) chama `https://repo-tests.onrender.com/api/...` diretamente; CORS só restringe navegadores.

Achados relacionados: C-01, A-03, A-04 do relatório de auditoria.

## Evidência
- `backend/build.gradle.kts:39-52`: sem `spring-boot-starter-security`.
- `backend/src/main/kotlin/br/com/synergia/rest/EntityAccountResource.kt:16-18`:
```kotlin
@PostMapping("/list-accounts-by-tenant")
fun listAccountsByTenant(@RequestParam("id-tenant") idTenant: Long, ...)
```
- `frontend/src/app/security/routing/has-active-tenant.ts:18-21`:
```ts
if (this.sessionService.getTenantId()) { return true; }
```
- `backend/src/main/kotlin/br/com/synergia/libs/entityEvent/models/UpsertEventDto.kt:4-5`: `idTenant` e `idAccount` vêm do corpo.
- `backend/src/main/kotlin/br/com/synergia/libs/utilsCommons/enums/AuthPermissionsEnum.kt:8-20`: o enum de permissões nunca é referenciado.

## Impacto
Leitura, criação, alteração e exclusão de dados de todas as instituições por qualquer pessoa na internet. É a causa raiz das issues de isolamento de tenant e IDOR.

## Sugestão de correção
1. Adicionar `spring-boot-starter-security` e emitir um token (JWT assinado com segredo vindo de variável de ambiente, ou sessão com cookie `HttpOnly`/`Secure`/`SameSite`) no login.
2. Configurar um `SecurityFilterChain` que exija autenticação em `/api/**`, liberando só login, cadastro de tenant e o mínimo de listagem pública.
3. Expor o usuário autenticado (`idAccount`, `idTenant`, permissões) como principal e removê-los dos DTOs e parâmetros.
4. Aplicar `AuthPermissionsEnum` com `@PreAuthorize` nas rotas administrativas.
5. No frontend, anexar o token num `HttpInterceptor` e esconder o menu Administração por permissão (apenas UX; o servidor decide).

## Critérios de aceite
- [ ] Requisição sem token a qualquer rota de `/api/**`, exceto as liberadas explicitamente, responde 401.
- [ ] Nenhum controller recebe `id-tenant`/`idTenant`/`idAccount` do cliente para decidir escopo ou autoria.
- [ ] Rotas administrativas respondem 403 para usuário sem a permissão correspondente.
- [ ] Teste de integração cobre 401 (sem token), 403 (sem permissão) e 200 (com permissão).
- [ ] O segredo de assinatura vem de variável de ambiente e a aplicação não sobe sem ele.
"""),
dict(titulo="[Segurança] Login dispensa a senha quando o cliente envia checkLastSeen=true",
     labels=["security", "severity:critical"],
     corpo="""## Descrição
O endpoint `POST /api/page-login/check-login-information` aceita o booleano `checkLastSeen` do cliente. Quando ele é `true`, o SQL não compara a senha: basta que o usuário tenha logado nas últimas 12 horas.

É explorável porque `idTenant` (via `list-all-tenants`) e `login` (via `list-accounts-by-tenant`) são públicos. Cada login bem-sucedido renova o `last_seen`, então o atacante mantém o acesso indefinidamente.

## Evidência
`backend/src/main/resources/sql/page-login/check-login-information.sql:13-18`
```sql
CASE
    WHEN :check_last_seen THEN (
        a.last_seen is NOT NULL AND
        ((now() - a.last_seen) < interval '12 hours')
    )
    ELSE a.password = :password END
```
`frontend/src/app/modules/page-login/route-login.component.ts:53-58`: o frontend envia `password: ''` e `checkLastSeen: true`.

`backend/src/test/kotlin/br/com/synergia/integration/PageLoginIntegrationTest.kt:121-133`: teste que garante o comportamento ("mesmo sem senha").

## Impacto
Entrar como qualquer usuário ativo, inclusive o `ADMIN` de cada instituição, sem conhecer a senha.

## Sugestão de correção
- Remover `checkLastSeen` do DTO e o ramo `CASE` do SQL; o login sempre exige senha.
- Implementar "continuar logado" com um refresh token opaco emitido pelo servidor, guardado em cookie `HttpOnly`, com expiração e revogação.
- Inverter o teste de integração para exigir que o login sem senha falhe.

## Critérios de aceite
- [ ] `LoginInformationInputDto` não tem mais `checkLastSeen`.
- [ ] Login com senha errada ou vazia retorna falha independentemente de `last_seen`.
- [ ] O teste "sessao recente é aceita ... mesmo sem senha" foi substituído por um teste que espera recusa.
- [ ] Reabrir o app após login recente funciona via token emitido pelo servidor, não via `localStorage` com IDs.
"""),
dict(titulo="[Segurança] IDOR em update de conta permite trocar a senha de qualquer usuário",
     labels=["security", "severity:critical"],
     corpo="""## Descrição
`POST /api/entity-account/update/{id-account}` carrega a conta pelo ID do path e sobrescreve login, e-mail, nome e senha sem verificar quem pede nem se a conta é do mesmo tenant. O `idTenant` do corpo é ignorado.

É explorável porque os IDs são sequenciais e a lista de contas de qualquer tenant é pública.

## Evidência
`backend/src/main/kotlin/br/com/synergia/libs/entityAccount/services/EntityAccountSqlService.kt:86-99`
```kotlin
accountRepository.findById(idAccount).ifPresent { account ->
    account.email = params.email
    account.login = params.login
    if (!params.password.isNullOrBlank()) {
        account.password = params.password
    }
    accountRepository.save(account)
}
```
`backend/src/main/kotlin/br/com/synergia/rest/EntityAccountResource.kt:55-63`

## Impacto
Tomada de conta total, inclusive do `ADMIN` de cada instituição; o dono legítimo perde o acesso.

## Sugestão de correção
- Permitir a edição só para a própria conta ou para quem tem `CREATE_USER` no mesmo tenant.
- Buscar com `findByIdAndIdTenant(id, principal.idTenant)` e responder 404 quando não encontrar.
- Troca de senha da própria conta deve exigir a senha atual.

## Critérios de aceite
- [ ] Usuário A não consegue alterar a conta de B (403/404), no mesmo ou em outro tenant.
- [ ] Administrador de um tenant não altera contas de outro tenant.
- [ ] Trocar a própria senha exige a senha atual.
- [ ] Testes de integração cobrem os três casos.
"""),
dict(titulo="[Segurança] Listagens por tenant confiam no id-tenant enviado pelo cliente",
     labels=["security", "severity:high"],
     corpo="""## Descrição
As listagens filtram por `id_tenant`, mas o valor vem do parâmetro `id-tenant` da requisição. Trocar o número dá acesso aos dados de outra instituição. `list-all-tenants` entrega a lista de IDs, inclusive de instituições privadas, e `get-account-by-login-or-email` confirma a existência de logins/e-mails.

Achados: A-01, A-02, M-01, B-01.

## Evidência
- `backend/src/main/kotlin/br/com/synergia/rest/EntityAccountResource.kt:16-26` e `backend/src/main/resources/sql/page-list-accounts/list-accounts.sql:9`
```sql
WHERE a.id_tenant = :id_tenant
```
- `backend/src/main/kotlin/br/com/synergia/rest/EntityEventResource.kt:15-24`
- `backend/src/main/kotlin/br/com/synergia/rest/EntityProjectResource.kt:15-24`
- `backend/src/main/kotlin/br/com/synergia/rest/EntityTagResource.kt:21-38`
- `backend/src/main/kotlin/br/com/synergia/libs/entityTenant/services/EntityTenantSqlService.kt:19-21`
```kotlin
return tenantRepository.findAll().map { it.toDto() }
```
- `backend/src/main/kotlin/br/com/synergia/rest/EntityAccountResource.kt:36-46`

## Impacto
Vazamento de login, nome e e-mail de todos os usuários e do conteúdo de todas as instituições, inclusive as privadas. Os logins alimentam o bypass de senha.

## Sugestão de correção
- Depende da issue de autenticação: usar `principal.idTenant` em vez do parâmetro e remover `id-tenant` das assinaturas.
- `list-all-tenants`: devolver só `id`/`title` de instituições não privadas, ou exigir o identifier exato.
- `get-account-by-login-or-email`: restringir a usuários autenticados do mesmo tenant.

## Critérios de aceite
- [ ] Nenhum endpoint de listagem aceita `id-tenant` do cliente.
- [ ] Usuário do tenant A recebe lista vazia/403 ao tentar dados do tenant B (teste de integração).
- [ ] `list-all-tenants` não retorna tenants com `is_private = true`.
- [ ] `get-account-by-login-or-email` responde 401 sem autenticação.
"""),
dict(titulo="[Segurança] Update e delete por ID sem verificação de posse (eventos, projetos, tags, contas, tenants)",
     labels=["security", "severity:high"],
     corpo="""## Descrição
Os handlers de escrita carregam o objeto pelo ID do path e alteram/apagam sem verificar tenant, membro ou papel. A exclusão de tag é um `GET`.

Achados: A-05, A-06, A-07.

## Evidência
- `backend/src/main/kotlin/br/com/synergia/rest/EntityDeleteByIdResource.kt:15-30`
```kotlin
@GetMapping("delete-tag-by-id/{id-tag}")   -> tagRepository.deleteById(idTag)
@DeleteMapping("/delete-account/{id-account}") -> accountRepository.deleteById(idAccount)
```
- `backend/src/main/kotlin/br/com/synergia/libs/entityEvent/services/EntityEventSqlService.kt:102-109`
- `backend/src/main/kotlin/br/com/synergia/libs/entityProject/services/EntityProjectSqlService.kt:91-97`
- `backend/src/main/kotlin/br/com/synergia/libs/entityTag/services/EntityTagSqlService.kt:61-69`
- `backend/src/main/kotlin/br/com/synergia/libs/entityTenant/services/EntityTenantSqlService.kt:43-49`
```kotlin
tenantRepository.findById(idTenant).ifPresent { tenant ->
    tenant.title = params.title
    tenant.identifier = params.identifier
```

## Impacto
Qualquer pessoa apaga contas e tags, altera eventos/projetos/tags de outras instituições e renomeia instituições (phishing no seletor de login).

## Sugestão de correção
- Criar um helper de autorização (`findOwnedOrThrow`) que busca por `id` + `idTenant` do principal e confere membro/organizador ou a permissão `EDIT_*_AS_NON_MEMBER` / `DELETE_*_AS_NON_OWNER`.
- Update de tenant só para o `ADMIN` daquele tenant.
- Trocar `GET delete-tag-by-id` por `DELETE`.
- Validar que as tags associadas (`params.tags`) pertencem ao mesmo tenant.

## Critérios de aceite
- [ ] Update/delete de objeto de outro tenant responde 404.
- [ ] Update de evento/projeto por não membro sem permissão responde 403.
- [ ] Update de tenant só é aceito para o ADMIN do próprio tenant.
- [ ] Não existe mais rota `GET` que apague dados.
- [ ] Testes de integração cobrem cada rota de escrita com usuário de outro tenant.
"""),
dict(titulo="[Segurança] Leitura por ID e por relacionamento sem filtro de tenant",
     labels=["security", "severity:medium"],
     corpo="""## Descrição
`get-*-by-id` e as listagens por evento/projeto/conta filtram só pelo ID do objeto ou do relacionamento. Com `lookup-members=true`, eventos e projetos vêm com login e e-mail dos membros.

Achados: M-02, M-03.

## Evidência
- `backend/src/main/kotlin/br/com/synergia/rest/EntityGetByIdResource.kt:31-85`
```kotlin
val el = accountRepository.findById(idAccount).orElse(null)?.toDto()
```
- `backend/src/main/resources/sql/entity-account/list-accounts-by-event.sql:10`
```sql
WHERE ear.id_event = :id_event
```
- `list-accounts-by-project.sql:10`, `list-events-by-account.sql:11`, `list-projects-by-account.sql:11`, `list-tags-of-event.sql:11`, `list-tags-of-project.sql:11`.

## Impacto
Enumeração de membros, e-mails e participação de qualquer conta em qualquer instituição.

## Sugestão de correção
- Adicionar `AND <tabela>.id_tenant = :id_tenant` com o tenant do principal em todas as queries por relacionamento.
- Trocar `findById` por `findByIdAndIdTenant` em `EntityGetByIdResource`.

## Critérios de aceite
- [ ] Toda query em `backend/src/main/resources/sql` que retorna dados de tenant tem filtro por `id_tenant` do principal.
- [ ] `get-*-by-id` de objeto de outro tenant responde 404.
- [ ] Teste de integração cobre leitura cruzada entre dois tenants.
"""),
dict(titulo="[Segurança] Token do Nx Cloud com escopo read-write versionado em repositório público",
     labels=["security", "severity:high"],
     corpo="""## Descrição
`frontend/nx.json` contém um `nxCloudAccessToken` que decodifica para `a9f3de68-c3c5-4e66-af91-acc03116ab03|read-write`. Ele está no repositório desde o commit inicial `5b929f2` (10/10/2024) e o repositório é público.

## Evidência
`frontend/nx.json:20`
```json
"nxCloudAccessToken": "YTlmM2RlNjgtYzNjNS00ZTY2LWFmOTEtYWNjMDMxMTZhYjAzfHJlYWQtd3JpdGU="
```

## Impacto
Com escrita no cache remoto, um terceiro pode publicar artefatos de build adulterados que builds futuros aceitam como cache hit (envenenamento de cache / cadeia de suprimentos). Também consome a cota da conta.

## Sugestão de correção
1. Revogar o token no painel do Nx Cloud.
2. Remover a chave do `nx.json` e usar a variável `NX_CLOUD_ACCESS_TOKEN` (secret no CI, `.env` local fora do git).
3. Se o Nx Cloud for mantido, usar token read-only para desenvolvedores e read-write só no CI.
4. Adicionar varredura de segredos (gitleaks ou GitHub secret scanning / push protection).

## Critérios de aceite
- [ ] O token antigo está revogado e uma chamada com ele falha.
- [ ] `frontend/nx.json` não contém `nxCloudAccessToken`.
- [ ] O CI obtém o token de `secrets.*`.
- [ ] Varredura de segredos roda no CI ou via push protection.
"""),
dict(titulo="[Segurança] Senhas de usuários armazenadas e comparadas em texto puro",
     labels=["security", "severity:high"],
     corpo="""## Descrição
A coluna `account.password` guarda a senha como veio do cliente, e o login compara com `=` no SQL. Não há bcrypt/argon2.

## Evidência
- `backend/src/main/kotlin/br/com/synergia/libs/utilsEntities/jpa/account/Account.kt:30-31`
- `backend/src/main/resources/sql/page-login/check-login-information.sql:18`
```sql
ELSE a.password = :password END
```
- `backend/src/main/kotlin/br/com/synergia/libs/entityAccount/services/EntityAccountSqlService.kt:73,95`
- `backend/src/main/kotlin/br/com/synergia/libs/entityTenant/services/EntityTenantSqlService.kt:37`

## Impacto
Qualquer leitura do banco (backup, dump, SQL injection futura, acesso indevido ao Render) expõe as senhas reais de todos os usuários.

## Sugestão de correção
- Usar `BCryptPasswordEncoder` (ou Argon2) do Spring Security para gravar e `matches()` para verificar, no código e não no SQL.
- Migração: na próxima autenticação bem-sucedida, regravar como hash; forçar troca de senha para contas não migradas após um prazo.

## Critérios de aceite
- [ ] Nenhuma senha em texto puro no banco (consulta de verificação retorna 0 linhas sem prefixo `$2`).
- [ ] O SQL de login não compara senha.
- [ ] Teste de integração confirma que o valor gravado difere da senha enviada e que o login funciona.
"""),
dict(titulo="[Segurança] Credenciais de banco padrão no código, na documentação e no histórico git",
     labels=["security", "severity:medium"],
     corpo="""## Descrição
O perfil importado por padrão traz usuário/senha reais da máquina de desenvolvimento, e os perfis de teste usam o mesmo valor como fallback quando a variável não existe. Não há validação de startup que recuse esses valores. Outras senhas estão no histórico git.

Achados: M-04, B-02, B-03.

## Evidência
- `backend/src/main/resources/application-datasource.yaml:4-5` (importado por `application.yaml:8`)
```yaml
username: raindrop
password: MaybeLater
```
- `backend/src/main/resources/application-e2e.yaml:14-15`: `${E2E_DB_PASSWORD:MaybeLater}`
- `backend/build.gradle.kts:89-90` e `backend/src/test/kotlin/br/com/synergia/integration/support/IntegrationTestBase.kt:44-45`: fallback `MaybeLater`
- `college/dev-ops/atv-01/response-02.md:185`, `college/dev-ops/atv-01/response-03.md:257,265`
- `backend/src/main/resources/application-datasource-windows.yaml:4-5`: `postgres` / `admin`
- Histórico: commit `0b79851` (`application-evoge.yaml:5`, `evoge_pass`, branch `origin/chore/atualiza-dependencias`); commits `87702be`/`8ce1026` (`password: Admin`).

## Impacto
Uma instância subida sem as variáveis conecta com credenciais conhecidas publicamente. Senhas publicadas tendem a ser reutilizadas em outros serviços.

## Sugestão de correção
1. Trocar as senhas `MaybeLater`, `evoge_pass` e `Admin` onde estiverem em uso.
2. Remover valores reais dos YAML: `${DB_PASSWORD}` sem default, com `.env.example` documentando as variáveis.
3. Adicionar validação na inicialização (ex.: `@PostConstruct` ou `EnvironmentPostProcessor`) que aborta fora do perfil de teste se a senha estiver vazia ou numa lista de valores padrão.
4. Opcional: reescrever o histórico (git filter-repo) só depois de rotacionar; a rotação é o que protege.

## Critérios de aceite
- [ ] Nenhum arquivo versionado contém `MaybeLater`, `evoge_pass` ou `password: admin`.
- [ ] A aplicação não sobe sem `DB_PASSWORD` definido (fora do perfil de teste).
- [ ] As senhas antigas foram trocadas nos bancos que as usavam.
- [ ] Documentação usa placeholders (`<sua-senha>`).
"""),
dict(titulo="[Segurança] bannerUrl aceita qualquer URL externa e expõe visitantes a rastreamento",
     labels=["security", "severity:low"],
     corpo="""## Descrição
`bannerUrl` de eventos e projetos é gravado sem validação e renderizado em `<img [src]>`. Não há XSS (o Angular sanitiza `[src]` e `<img>` não executa script), mas qualquer URL externa é carregada pelo navegador de quem abre o card.

## Evidência
- `backend/src/main/kotlin/br/com/synergia/libs/entityEvent/services/EntityEventSqlService.kt:75,106`
- `backend/src/main/kotlin/br/com/synergia/libs/entityProject/services/EntityProjectSqlService.kt:72,95`
- `frontend/src/libs/components/src/lib/safe-image/safe-image.component.html:4`
```html
<img class="banner-img" [src]="url" (error)="errorOnLoad()" />
```

## Impacto
Coleta de IP, User-Agent e horário de quem visualiza; conteúdo impróprio; combinada com o IDOR de update, troca de banner de eventos alheios.

## Sugestão de correção
- Aceitar só `https://` e, de preferência, uma lista de domínios permitidos; validar no backend (`@Pattern` + checagem de host).
- Alternativa: upload para storage próprio e servir pela aplicação.
- Adicionar `referrerpolicy="no-referrer"` na `<img>` e uma CSP com `img-src` restrito.

## Critérios de aceite
- [ ] Backend rejeita `bannerUrl` que não seja `https://` de domínio permitido (400).
- [ ] Teste unitário cobre `http:`, `javascript:`, `data:` e domínio não permitido.
- [ ] Frontend exibe a cor de fallback para URLs rejeitadas.
"""),
dict(titulo="[Segurança] Mensagens de exceção e Swagger expostos publicamente",
     labels=["security", "severity:low"],
     corpo="""## Descrição
Toda exceção vira o header `x-error` com a mensagem crua (até 8 KB), incluindo erros de JPA/Postgres com nomes de tabelas e constraints. O Swagger UI e `/v3/api-docs` estão ativos em produção.

Achados: B-X1, I-03.

## Evidência
- `backend/src/main/kotlin/br/com/synergia/libs/utilsCommons/objects/ResponseMessenger.kt:12-14,26-32`
```kotlin
errorTemplate(truncateForHeader((e.message ?: "Erro desconhecido.")))
headers.set("x-error", sanitizedMessage)
```
- `backend/build.gradle.kts:48-49`: `springdoc-openapi-starter-webmvc-ui`, sem `springdoc.*.enabled=false` em nenhum perfil.

## Impacto
Facilita o reconhecimento do esquema e da superfície da API.

## Sugestão de correção
- Mensagens de negócio: exceção própria (`BusinessException`) cuja mensagem pode ir ao cliente; demais erros: texto genérico + ID de correlação, com o detalhe só no log.
- Trocar `Content-Type: text/html` das respostas de erro por `application/problem+json`.
- No perfil de produção: `springdoc.api-docs.enabled=false` e `springdoc.swagger-ui.enabled=false`.

## Critérios de aceite
- [ ] Erro de banco provocado em produção devolve mensagem genérica sem nomes de tabela/constraint.
- [ ] `GET /swagger-ui.html` e `/v3/api-docs` respondem 404 no perfil de produção.
- [ ] O log contém o ID de correlação e a exceção completa.
"""),
dict(titulo="[Segurança] Exigir autorização nos endpoints de permissões e relacionamentos antes de implementá-los",
     labels=["security", "severity:info"],
     corpo="""## Descrição
`POST /api/action-attribute-permissions/attribute-permissions` e os três endpoints de `action-manage-relationships` não verificam papel nem tenant. Hoje são inertes: o arquivo SQL de atribuição está vazio e os métodos de relacionamento não têm corpo. Quando forem implementados como estão, o primeiro permite que qualquer um conceda a si mesmo qualquer permissão.

## Evidência
- `backend/src/main/kotlin/br/com/synergia/rest/ActionAttributePermissionsResource.kt:17-22`
- `backend/src/main/resources/sql/action-attribute-permissions/attribute-permissions.sql` (0 bytes)
- `backend/src/main/kotlin/br/com/synergia/rest/ActionManageRelationshipsResource.kt:16-36`
- `backend/src/main/kotlin/br/com/synergia/libs/actionManageRelationships/services/ActionManageRelationshipsSqlService.kt:10-27`

## Impacto
Latente: escalada de privilégio e vínculo de objetos entre tenants quando a funcionalidade for concluída.

## Sugestão de correção
- Implementar junto com a checagem: só quem tem permissão administrativa no tenant atribui permissões; `idAccounts` e `idPermissions` validados contra o tenant do principal.
- Relacionamentos: exigir que evento, projeto e tag sejam do tenant do principal e que o chamador seja membro/organizador.

## Critérios de aceite
- [ ] Usuário sem permissão administrativa recebe 403 em `attribute-permissions`.
- [ ] Não é possível atribuir permissões a contas de outro tenant.
- [ ] Relacionar objetos de tenants diferentes responde 400/404.
- [ ] Testes de integração cobrem os três casos antes do merge da funcionalidade.
"""),
]
