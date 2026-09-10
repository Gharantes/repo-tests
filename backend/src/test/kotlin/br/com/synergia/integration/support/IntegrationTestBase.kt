package br.com.synergia.integration.support

import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.server.LocalServerPort
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import br.com.synergia.libs.entityAccount.models.UpsertAccountDto
import br.com.synergia.libs.entityAccount.services.EntityAccountSqlService
import br.com.synergia.libs.entityEvent.models.UpsertEventDto
import br.com.synergia.libs.entityEvent.services.EntityEventSqlService
import br.com.synergia.libs.entityProject.models.UpsertProjectDto
import br.com.synergia.libs.entityProject.services.EntityProjectSqlService
import br.com.synergia.libs.entityTag.models.UpsertTagDto
import br.com.synergia.libs.entityTag.services.EntityTagSqlService
import br.com.synergia.libs.entityTenant.models.UpsertTenantDto
import br.com.synergia.libs.entityTenant.services.EntityTenantSqlService
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpMethod
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.http.client.ClientHttpResponse
import org.springframework.web.client.ResponseErrorHandler
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.DefaultUriBuilderFactory

/**
 * Base de todos os testes de integração.
 *
 * Não há mock em lugar nenhum. Sobe o contexto real do Spring Boot com o Tomcat
 * real numa porta aleatória, e as requisições saem pela rede via
 * [RestTemplate] batendo nos mesmos controllers que a aplicação publica. Do
 * outro lado há um PostgreSQL real: as consultas executadas são os mesmos
 * arquivos `.sql` de produção, com `ILIKE`, `interval` e tudo que é específico do
 * Postgres.
 *
 * O banco usado é o `synergia_test`, separado do `synergia_dev`, para que rodar a
 * suíte nunca apague dados de desenvolvimento. O endereço vem das variáveis
 * TEST_DB_URL / TEST_DB_USERNAME / TEST_DB_PASSWORD, que é como o pipeline de CI
 * aponta para o Postgres dele.
 */
@SpringBootTest(
    webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
    properties = [
        "spring.datasource.url=\${TEST_DB_URL:jdbc:postgresql://localhost:5432/synergia_test}",
        "spring.datasource.username=\${TEST_DB_USERNAME:raindrop}",
        "spring.datasource.password=\${TEST_DB_PASSWORD:MaybeLater}",
        "spring.jpa.hibernate.ddl-auto=update",
    ]
)
abstract class IntegrationTestBase {

    @LocalServerPort
    protected var porta: Int = 0

    /**
     * O Spring Boot 4 removeu o RestTemplate. Isto refaz as duas coisas
     * que ele dava e que a suíte usa: a porta aleatória já embutida, para que
     * os testes sigam pedindo "/api/...", e um tratador de erro que não lança
     * em 4xx/5xx - sem ele, todo teste que afirma sobre status de erro viraria
     * exceção no lugar de asserção.
     */
    protected val rest: RestTemplate by lazy {
        RestTemplate().apply {
            uriTemplateHandler = DefaultUriBuilderFactory("http://localhost:$porta")
            errorHandler = ResponseErrorHandler { _: ClientHttpResponse -> false }
        }
    }

    @Autowired
    protected lateinit var jdbc: JdbcTemplate

    /**
     * Zera o banco antes de cada teste, para que um teste nunca dependa do que
     * outro deixou para trás. A ordem respeita as chaves estrangeiras: os
     * relacionamentos caem antes das entidades que eles apontam.
     */
    @BeforeEach
    fun limparBanco() {
        TABELAS_NA_ORDEM_DE_EXCLUSAO.forEach { jdbc.execute("DELETE FROM $it") }
    }

    // ---------------------------------------------------------------------
    // Massa de dados.
    //
    // A preparação usa os SqlServices da própria aplicação, não INSERT escrito
    // à mão: é o mesmo código que grava em produção, então o esquema fica
    // declarado num lugar só. Os SqlServices são a camada certa para isso
    // porque, ao contrário dos Services, eles não têm efeito colateral - criar
    // um tenant cria só o tenant, sem a conta ADMIN junto; criar um projeto
    // cria só o projeto, sem o vínculo de autoria. Isso deixa o teste montar
    // exatamente o estado que ele quer verificar.
    // ---------------------------------------------------------------------

    @Autowired
    protected lateinit var tenantSqlService: EntityTenantSqlService

    @Autowired
    protected lateinit var accountSqlService: EntityAccountSqlService

    @Autowired
    protected lateinit var projectSqlService: EntityProjectSqlService

    @Autowired
    protected lateinit var eventSqlService: EntityEventSqlService

    @Autowired
    protected lateinit var tagSqlService: EntityTagSqlService

    protected fun criarTenant(
        identifier: String = "fag",
        title: String = "FAG",
        isPrivate: Boolean = false,
    ): Long {
        // createTenant não devolve o id, então relemos pelo identifier, que é
        // único por constraint.
        tenantSqlService.createTenant(
            UpsertTenantDto(title = title, identifier = identifier, password = "irrelevante", isPrivate = isPrivate)
        )
        return tenantSqlService.getTenantByIdentifier(identifier)!!.id
    }

    protected fun criarConta(
        idTenant: Long,
        login: String,
        senha: String = "senha123",
        primeiroNome: String = "Aluno",
        sobrenome: String = "Teste",
        email: String = "$login@fag.edu.br",
        tags: List<Long> = emptyList(),
    ): Long {
        val idConta = accountSqlService.createAccount(
            UpsertAccountDto(
                idTenant = idTenant,
                email = email,
                login = login,
                password = senha,
                firstName = primeiroNome,
                lastName = sobrenome,
            )
        )
        if (tags.isNotEmpty()) {
            accountSqlService.createAccountTagRelationship(idConta, tags)
        }
        return idConta
    }

    protected fun criarProjeto(
        idTenant: Long,
        titulo: String,
        descricao: String = "Descrição do projeto de teste.",
        bannerUrl: String? = null,
    ): Long = projectSqlService.createProject(
        // idAccount e tags entram no DTO mas createProject não os usa: quem
        // grava o vínculo do autor e as tags é o Service, uma camada acima.
        UpsertProjectDto(
            idTenant = idTenant,
            idAccount = 0L,
            title = titulo,
            description = descricao,
            bannerUrl = bannerUrl,
            tags = emptyList(),
        )
    )

    protected fun criarEvento(
        idTenant: Long,
        titulo: String,
        descricao: String = "Descrição do evento de teste.",
        bannerUrl: String? = null,
    ): Long = eventSqlService.createEvent(
        UpsertEventDto(
            idTenant = idTenant,
            idAccount = 0L,
            title = titulo,
            description = descricao,
            bannerUrl = bannerUrl,
            tags = emptyList(),
        )
    )

    protected fun criarTag(
        idTenant: Long,
        titulo: String,
        paraProjetos: Boolean = true,
        paraEventos: Boolean = false,
        paraContas: Boolean = false,
    ): Long {
        // createTag também não devolve o id; relemos pela listagem do tenant.
        tagSqlService.createTag(
            UpsertTagDto(
                idTenant = idTenant,
                title = titulo,
                forProjects = paraProjetos,
                forEvents = paraEventos,
                forAccounts = paraContas,
            )
        )
        return tagSqlService
            .listTags(idTenant, forProjects = false, forEvents = false, forAccounts = false, text = titulo)
            .first { it.title == titulo }
            .id
    }

    protected fun vincularContaAoProjeto(idConta: Long, idProjeto: Long, papel: String = "Integrante") {
        projectSqlService.createProjectAccountRelationship(idConta, idProjeto, membershipLabel = papel)
    }

    protected fun vincularContaAoEvento(idConta: Long, idEvento: Long, papel: String = "Organizador") {
        eventSqlService.createEventAccountRelationship(idEvento, idConta, membershipLabel = papel)
    }

    protected fun vincularTagAoProjeto(idTag: Long, idProject: Long) {
        projectSqlService.createProjectTagRelationship(idProject, tags=listOf(idTag))
    }

    protected fun vincularTagAoEvento(idTag: Long, idEvento: Long) {
        eventSqlService.createEventTagRelationship(idEvento, listOf(idTag))
    }

    protected fun vincularTagAConta(idTag: Long, idConta: Long) {
        accountSqlService.createAccountTagRelationship(idConta, listOf(idTag))
    }

    // ---------------------------------------------------------------------
    // Consultas de conferência: leem o estado real gravado no banco.
    // ---------------------------------------------------------------------

    protected fun contarLinhas(tabela: String, where: String = "TRUE", vararg args: Any?): Int =
        jdbc.queryForObject("SELECT COUNT(*) FROM $tabela WHERE $where", Int::class.java, *args)!!

    companion object {
        val TABELAS_NA_ORDEM_DE_EXCLUSAO = listOf(
            "event_post_relationship",
            "post",
            "account_tag_relationship",
            "project_tag_relationship",
            "event_tag_relationship",
            "project_account_relationship",
            "event_account_relationship",
            "tags",
            "project",
            "event",
            "account",
            "tenant",
        )
    }
}

// -------------------------------------------------------------------------
// Atalhos de HTTP. Ficam como funções de extensão de topo porque `inline` com
// `reified` não é permitido em membro de classe aberta.
// -------------------------------------------------------------------------

/** POST com corpo JSON, do jeito que o frontend Angular manda. */
inline fun <reified R : Any> RestTemplate.postJson(url: String, corpo: Any?): ResponseEntity<R> {
    val headers = HttpHeaders().apply { contentType = MediaType.APPLICATION_JSON }
    return this.postForEntity(url, HttpEntity(corpo, headers), R::class.java)
}

/** POST sem corpo, usado pelos endpoints que recebem tudo por query string. */
inline fun <reified R : Any> RestTemplate.postSemCorpo(url: String): ResponseEntity<R> =
    this.postForEntity(url, HttpEntity<Void>(HttpHeaders()), R::class.java)

/** POST que devolve uma lista JSON, preservando o tipo dos elementos. */
inline fun <reified R : Any> RestTemplate.postForList(url: String, corpo: Any? = null): ResponseEntity<List<R>> {
    val headers = HttpHeaders().apply { contentType = MediaType.APPLICATION_JSON }
    return this.exchange(
        url,
        HttpMethod.POST,
        HttpEntity(corpo, headers),
        object : ParameterizedTypeReference<List<R>>() {},
    )
}

/** GET que devolve uma lista JSON, preservando o tipo dos elementos. */
inline fun <reified R : Any> RestTemplate.getForList(url: String): ResponseEntity<List<R>> =
    this.exchange(
        url,
        HttpMethod.GET,
        HttpEntity<Void>(HttpHeaders()),
        object : ParameterizedTypeReference<List<R>>() {},
    )
