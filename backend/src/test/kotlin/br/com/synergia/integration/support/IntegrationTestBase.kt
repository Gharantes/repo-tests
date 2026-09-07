package br.com.synergia.integration.support

import org.junit.jupiter.api.BeforeEach
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.core.ParameterizedTypeReference
import org.springframework.http.HttpMethod
import org.springframework.jdbc.core.JdbcTemplate
import java.time.LocalDateTime

/**
 * Base de todos os testes de integração.
 *
 * Não há mock em lugar nenhum. Sobe o contexto real do Spring Boot com o Tomcat
 * real numa porta aleatória, e as requisições saem pela rede via
 * [TestRestTemplate] batendo nos mesmos controllers que a aplicação publica. Do
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

    @Autowired
    protected lateinit var rest: TestRestTemplate

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
    // Massa de dados: linhas de verdade, inseridas no Postgres de verdade.
    // Nada aqui é dublê; é o mesmo INSERT que a aplicação faria.
    // ---------------------------------------------------------------------

    protected fun criarTenant(
        identifier: String = "fag",
        title: String = "FAG",
        isPrivate: Boolean = false,
    ): Long = jdbc.queryForObject(
        "INSERT INTO tenant (identifier, title, is_private) VALUES (?, ?, ?) RETURNING id",
        Long::class.java, identifier, title, isPrivate,
    )!!

    protected fun criarConta(
        idTenant: Long,
        login: String,
        senha: String = "senha123",
        primeiroNome: String = "Aluno",
        sobrenome: String = "Teste",
        email: String? = null,
    ): Long = jdbc.queryForObject(
        """
        INSERT INTO account (id_tenant, login, password, first_name, last_name, email,
                             created_at, updated_at, last_seen)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id
        """.trimIndent(),
        Long::class.java, idTenant, login, senha, primeiroNome, sobrenome, email,
        // As colunas de data são NOT NULL sem default no esquema gerado pelo
        // Hibernate; quem preenche é a própria entidade Account, com
        // LocalDateTime.now(). A massa de teste faz o mesmo.
        LocalDateTime.now(), LocalDateTime.now(), LocalDateTime.now(),
    )!!

    protected fun criarProjeto(
        idTenant: Long,
        titulo: String,
        descricao: String = "Descrição do projeto de teste.",
        bannerUrl: String? = null,
        bannerColor: String = "#B3D9FF",
    ): Long = jdbc.queryForObject(
        """
        INSERT INTO project (id_tenant, title, description, banner_url, banner_color)
        VALUES (?, ?, ?, ?, ?) RETURNING id
        """.trimIndent(),
        Long::class.java, idTenant, titulo, descricao, bannerUrl, bannerColor,
    )!!

    protected fun criarEvento(
        idTenant: Long,
        titulo: String,
        descricao: String = "Descrição do evento de teste.",
        bannerColor: String = "#FFB3BA",
    ): Long = jdbc.queryForObject(
        """
        INSERT INTO event (id_tenant, title, description, banner_url, banner_color)
        VALUES (?, ?, ?, NULL, ?) RETURNING id
        """.trimIndent(),
        Long::class.java, idTenant, titulo, descricao, bannerColor,
    )!!

    protected fun criarTag(
        idTenant: Long,
        titulo: String,
        paraProjetos: Boolean = true,
        paraEventos: Boolean = false,
        paraContas: Boolean = false,
    ): Long = jdbc.queryForObject(
        """
        INSERT INTO tags (id_tenant, title, for_projects, for_events, for_accounts, created_at)
        VALUES (?, ?, ?, ?, ?, ?) RETURNING id
        """.trimIndent(),
        Long::class.java, idTenant, titulo, paraProjetos, paraEventos, paraContas, LocalDateTime.now(),
    )!!

    protected fun vincularContaAoProjeto(idConta: Long, idProjeto: Long, papel: String = "Integrante") {
        jdbc.update(
            "INSERT INTO project_account_relationship (id_account, id_project, membership_label) VALUES (?, ?, ?)",
            idConta, idProjeto, papel,
        )
    }

    protected fun vincularContaAoEvento(idConta: Long, idEvento: Long, papel: String = "Integrante") {
        jdbc.update(
            "INSERT INTO event_account_relationship (id_account, id_event, membership_label) VALUES (?, ?, ?)",
            idConta, idEvento, papel,
        )
    }

    protected fun vincularTagAoProjeto(idTag: Long, idProjeto: Long) {
        jdbc.update(
            "INSERT INTO project_tag_relationship (id_tag, id_project) VALUES (?, ?)",
            idTag, idProjeto,
        )
    }

    protected fun vincularTagAConta(idTag: Long, idConta: Long) {
        jdbc.update(
            "INSERT INTO account_tag_relationship (id_tag, id_account) VALUES (?, ?)",
            idTag, idConta,
        )
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
inline fun <reified R> TestRestTemplate.postJson(url: String, corpo: Any?): ResponseEntity<R> {
    val headers = HttpHeaders().apply { contentType = MediaType.APPLICATION_JSON }
    return this.postForEntity(url, HttpEntity(corpo, headers), R::class.java)
}

/** POST sem corpo, usado pelos endpoints que recebem tudo por query string. */
inline fun <reified R> TestRestTemplate.postSemCorpo(url: String): ResponseEntity<R> =
    this.postForEntity(url, HttpEntity<Void>(HttpHeaders()), R::class.java)

/** POST que devolve uma lista JSON, preservando o tipo dos elementos. */
inline fun <reified R> TestRestTemplate.postForList(url: String, corpo: Any? = null): ResponseEntity<List<R>> {
    val headers = HttpHeaders().apply { contentType = MediaType.APPLICATION_JSON }
    return this.exchange(
        url,
        HttpMethod.POST,
        HttpEntity(corpo, headers),
        object : ParameterizedTypeReference<List<R>>() {},
    )
}

/** GET que devolve uma lista JSON, preservando o tipo dos elementos. */
inline fun <reified R> TestRestTemplate.getForList(url: String): ResponseEntity<List<R>> =
    this.exchange(
        url,
        HttpMethod.GET,
        HttpEntity<Void>(HttpHeaders()),
        object : ParameterizedTypeReference<List<R>>() {},
    )
