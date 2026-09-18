package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.libs.entityTenant.models.UpsertTenantDto
import br.com.synergia.libs.utilsEntities.models.TenantDto
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

/**
 * Integração dos tenants (instituições).
 *
 * O tenant é a raiz de todo o isolamento de dados do sistema, e criá-lo tem um
 * efeito colateral que precisa acontecer junto: a conta ADMIN. Se o tenant fosse
 * gravado sem o admin, ninguém conseguiria entrar na instituição recém-criada.
 * Um teste de unidade não pegaria isso, porque a garantia depende das duas
 * escritas caírem no banco.
 */
@DisplayName("Integração: tenants")
class EntityTenantIntegrationTest : IntegrationTestBase() {

    private val store = "/api/entity-tenant/store"
    private val listar = "/api/entity-tenant/list-all-tenants"

    @Test
    fun `criar tenant grava a instituição e a conta ADMIN junto`() {
        val resposta = rest.postJson<Void>(
            store,
            UpsertTenantDto(title = "FAG", identifier = "fag", login = "ADMIN", password = "AdminSenha123"),
        )

        resposta.statusCode shouldBe HttpStatus.OK

        val idTenant = jdbc.queryForObject(
            "SELECT id FROM tenant WHERE identifier = ?", Long::class.java, "fag",
        )!!

        val admin = jdbc.queryForMap("SELECT * FROM account WHERE id_tenant = ? AND login = 'ADMIN'", idTenant)
        admin["password"] shouldBe "AdminSenha123"
        admin["first_name"] shouldBe "System"
        admin["last_name"] shouldBe "Admin"
    }

    @Test
    fun `o ADMIN criado consegue autenticar de verdade`() {
        // Fecha o ciclo: cria a instituição e entra com o admin, usando o mesmo
        // endpoint de login que a tela usa.
        rest.postJson<Void>(
            store,
            UpsertTenantDto("FAG", "fag", "ADMIN", "AdminSenha123"),
        )
        val idTenant = jdbc.queryForObject(
            "SELECT id FROM tenant WHERE identifier = ?", Long::class.java, "fag",
        )!!

        val login = rest.postJson<br.com.synergia.libs.pageLogin.models.LoginInformationResponseDto>(
            "/api/page-login/check-login-information",
            br.com.synergia.libs.pageLogin.models.LoginInformationInputDto(
                idTenant, "ADMIN", "AdminSenha123", checkLastSeen = false,
            ),
        )

        login.body.shouldNotBeNull().login shouldBe "ADMIN"
    }

    @Test
    fun `identifier repetido é recusado e não cria tenant nem admin duplicado`() {
        rest.postJson<Void>(store, UpsertTenantDto("FAG", "fag", "ADMIN", "Senha1"))

        val segunda = rest.postJson<String>(
            store,
            UpsertTenantDto("Outra Faculdade", "fag", "ADMIN", "Senha2"),
        )

        segunda.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        segunda.headers.getFirst("x-error") shouldBe
            "Já existe um tenant com esse mesmo identifier: fag"

        contarLinhas("tenant", "identifier = ?", "fag") shouldBe 1
        contarLinhas("account", "login = 'ADMIN'") shouldBe 1
    }

    @Test
    fun `identifier fora do formato de URL é recusado`() {
        listOf("FAG", "fag cascavel", "fág", "a/b", "-fag", "fag-").forEach { identifier ->
            val resposta = rest.postJson<String>(
                store,
                UpsertTenantDto("FAG", identifier, "ADMIN", "Senha1"),
            )

            resposta.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
            resposta.headers.getFirst("x-error") shouldBe
                "Identifier inválido: use apenas letras minúsculas, números e hífen."
        }

        contarLinhas("tenant") shouldBe 0
    }

    @Test
    fun `a primeira conta usa o login informado`() {
        rest.postJson<Void>(store, UpsertTenantDto("FAG", "fag", "  coordenacao  ", "Senha1"))

        jdbc.queryForList("SELECT login FROM account", String::class.java) shouldBe listOf("coordenacao")
    }

    @Test
    fun `login do administrador em branco é recusado`() {
        val resposta = rest.postJson<String>(store, UpsertTenantDto("FAG", "fag", "   ", "Senha1"))

        resposta.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        resposta.headers.getFirst("x-error") shouldBe "Informe o login do administrador."
        contarLinhas("tenant") shouldBe 0
        contarLinhas("account") shouldBe 0
    }

    @Test
    fun `atualizar tenant com identifier inválido não altera a linha`() {
        val idTenant = criarTenant(identifier = "fag", title = "FAG")

        val resposta = rest.postJson<String>(
            "/api/entity-tenant/update/$idTenant",
            UpsertTenantDto("FAG", "FAG Cascavel", "ADMIN", "ignorada"),
        )

        resposta.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        jdbc.queryForObject("SELECT identifier FROM tenant WHERE id = ?", String::class.java, idTenant) shouldBe "fag"
    }

    @Test
    fun `listar tenants devolve as instituições cadastradas`() {
        criarTenant(identifier = "fag", title = "FAG")
        criarTenant(identifier = "outra", title = "Outra Faculdade")

        val lista = rest.postForList<TenantDto>(listar)

        lista.statusCode shouldBe HttpStatus.OK
        val tenants = lista.body.shouldNotBeNull()
        tenants shouldHaveSize 2
        tenants.map { it.identifier }.toSet() shouldBe setOf("fag", "outra")
    }

    @Test
    fun `atualizar tenant troca título e identifier`() {
        val idTenant = criarTenant(identifier = "fag", title = "FAG")

        val resposta = rest.postJson<Void>(
            "/api/entity-tenant/update/$idTenant",
            UpsertTenantDto("FAG Cascavel", "fag-cascavel", "ADMIN", "ignorada"),
        )

        resposta.statusCode shouldBe HttpStatus.OK
        val linha = jdbc.queryForMap("SELECT title, identifier FROM tenant WHERE id = ?", idTenant)
        linha["title"] shouldBe "FAG Cascavel"
        linha["identifier"] shouldBe "fag-cascavel"
    }

    @Test
    fun `atualizar tenant inexistente não cria linha nova`() {
        val resposta = rest.postJson<Void>(
            "/api/entity-tenant/update/999999",
            UpsertTenantDto("Fantasma", "fantasma", "ADMIN", "x"),
        )

        // O serviço usa ifPresent: some silenciosamente, sem estourar.
        resposta.statusCode shouldBe HttpStatus.OK
        contarLinhas("tenant") shouldBe 0
    }
}
