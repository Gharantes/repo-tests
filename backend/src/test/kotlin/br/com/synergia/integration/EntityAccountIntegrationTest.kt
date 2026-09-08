package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.libs.entityAccount.models.UpsertAccountDto
import br.com.synergia.libs.utilsEntities.models.AccountDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

/**
 * Integração das contas (RF01, RF11).
 *
 * Cobre criação, atualização, listagem com busca e a checagem de login/e-mail já
 * usado, que é a validação que a tela de cadastro chama antes de deixar salvar.
 */
@DisplayName("Integração: contas")
class EntityAccountIntegrationTest : IntegrationTestBase() {

    private val store = "/api/entity-account/store"
    private val porTenant = "/api/entity-account/list-accounts-by-tenant"
    private val loginOuEmail = "/api/entity-account/get-account-by-login-or-email"

    @Test
    fun `criar conta grava a linha com todos os campos`() {
        val idTenant = criarTenant()

        val resposta = rest.postJson<Void>(
            store,
            UpsertAccountDto(
                idTenant = idTenant,
                email = "ana@fag.edu.br",
                login = "ana",
                password = "SenhaForte123",
                firstName = "Ana",
                lastName = "Souza",
            ),
        )

        resposta.statusCode shouldBe HttpStatus.OK

        val linha = jdbc.queryForMap("SELECT * FROM account WHERE login = ?", "ana")
        linha["email"] shouldBe "ana@fag.edu.br"
        linha["first_name"] shouldBe "Ana"
        linha["last_name"] shouldBe "Souza"
        linha["id_tenant"] shouldBe idTenant
        // As colunas de data são preenchidas pela entidade, não pelo banco.
        linha["created_at"].shouldNotBeNull()
        linha["last_seen"].shouldNotBeNull()
    }

    @Test
    fun `criar conta sem senha é recusado e nada é gravado`() {
        val idTenant = criarTenant()

        val resposta = rest.postJson<String>(
            store,
            UpsertAccountDto(idTenant, "ana@fag.edu.br", "ana", null, "Ana", "Souza"),
        )

        resposta.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        resposta.headers.getFirst("x-error") shouldBe "Senha inválida."
        contarLinhas("account") shouldBe 0
    }

    @Test
    fun `criar conta com senha em branco também é recusado`() {
        val idTenant = criarTenant()

        val resposta = rest.postJson<String>(
            store,
            UpsertAccountDto(idTenant, "ana@fag.edu.br", "ana", "   ", "Ana", "Souza"),
        )

        resposta.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        contarLinhas("account") shouldBe 0
    }

    @Test
    fun `criar conta liga as tags de área escolhidas`() {
        val idTenant = criarTenant()
        val idDesign = criarTag(idTenant, "Design", paraProjetos = false, paraContas = true)
        val idTi = criarTag(idTenant, "TI", paraProjetos = false, paraContas = true)

        rest.postJson<Void>(
            store,
            UpsertAccountDto(idTenant, "ana@fag.edu.br", "ana", "Senha123", "Ana", "Souza", listOf(idDesign, idTi)),
        )

        val idConta = jdbc.queryForObject("SELECT id FROM account WHERE login = ?", Long::class.java, "ana")!!
        val tags = jdbc.queryForList(
            "SELECT id_tag FROM account_tag_relationship WHERE id_account = ?", Long::class.java, idConta,
        )
        tags shouldContainExactlyInAnyOrder listOf(idDesign, idTi)
    }

    @Test
    fun `listar contas do tenant não vaza contas de outra instituição`() {
        val idFag = criarTenant(identifier = "fag", title = "FAG")
        val idOutra = criarTenant(identifier = "outra", title = "Outra")
        criarConta(idFag, login = "ana", primeiroNome = "Ana")
        criarConta(idOutra, login = "bruno", primeiroNome = "Bruno")

        val lista = rest.postForList<AccountDto>("$porTenant?id-tenant=$idFag")

        val contas = lista.body.shouldNotBeNull()
        contas shouldHaveSize 1
        contas[0].login shouldBe "ana"
    }

    @Test
    fun `a busca de contas olha login, primeiro nome e sobrenome`() {
        val idTenant = criarTenant()
        criarConta(idTenant, login = "ana", primeiroNome = "Ana", sobrenome = "Souza")
        criarConta(idTenant, login = "bruno", primeiroNome = "Bruno", sobrenome = "Lima")
        criarConta(idTenant, login = "carla", primeiroNome = "Carla", sobrenome = "Souza")

        // Por login
        rest.postForList<AccountDto>("$porTenant?id-tenant=$idTenant&text=bruno")
            .body.shouldNotBeNull() shouldHaveSize 1

        // Por sobrenome, pegando as duas Souza
        rest.postForList<AccountDto>("$porTenant?id-tenant=$idTenant&text=souza")
            .body.shouldNotBeNull().map { it.login } shouldContainExactlyInAnyOrder listOf("ana", "carla")

        // Sem correspondência
        rest.postForList<AccountDto>("$porTenant?id-tenant=$idTenant&text=zzzz")
            .body.shouldNotBeNull().shouldBeEmpty()
    }

    @Test
    fun `listar contas com lookup-tags traz as tags de cada conta`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "ana")
        val idDesign = criarTag(idTenant, "Design", paraProjetos = false, paraContas = true)
        vincularTagAConta(idDesign, idConta)

        val lista = rest.postForList<AccountDto>("$porTenant?id-tenant=$idTenant&lookup-tags=true")

        val contas = lista.body.shouldNotBeNull()
        contas shouldHaveSize 1
        contas[0].tags shouldHaveSize 1
        contas[0].tags[0].title shouldBe "Design"
    }

    @Test
    fun `sem lookup-tags a listagem não carrega tags`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "ana")
        vincularTagAConta(criarTag(idTenant, "Design", paraContas = true), idConta)

        val lista = rest.postForList<AccountDto>("$porTenant?id-tenant=$idTenant")

        lista.body.shouldNotBeNull()[0].tags.shouldBeEmpty()
    }

    @Test
    fun `login já usado no tenant é reportado como indisponível`() {
        val idTenant = criarTenant()
        criarConta(idTenant, login = "ana", email = "ana@fag.edu.br")

        val resposta = rest.getForEntity(
            "$loginOuEmail?id-tenant=$idTenant&login=ana&email=naoexiste@fag.edu.br", Boolean::class.java,
        )

        resposta.statusCode shouldBe HttpStatus.OK
        resposta.body shouldBe true
    }

    @Test
    fun `email já usado no tenant é reportado como indisponível`() {
        val idTenant = criarTenant()
        criarConta(idTenant, login = "ana", email = "ana@fag.edu.br")

        val resposta = rest.getForEntity(
            "$loginOuEmail?id-tenant=$idTenant&login=outroLogin&email=ana@fag.edu.br", Boolean::class.java,
        )

        resposta.body shouldBe true
    }

    @Test
    fun `login livre é reportado como disponível`() {
        val idTenant = criarTenant()
        criarConta(idTenant, login = "ana", email = "ana@fag.edu.br")

        val resposta = rest.getForEntity(
            "$loginOuEmail?id-tenant=$idTenant&login=novoLogin&email=novo@fag.edu.br", Boolean::class.java,
        )

        resposta.body shouldBe false
    }

    @Test
    fun `a própria conta não conta como conflito ao editar`() {
        // Ao salvar a edição do próprio perfil, o login continua o mesmo e isso
        // não pode ser tratado como "já em uso".
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "ana", email = "ana@fag.edu.br")

        val resposta = rest.getForEntity(
            "$loginOuEmail?id-tenant=$idTenant&id-account=$idConta&login=ana&email=ana@fag.edu.br",
            Boolean::class.java,
        )

        resposta.body shouldBe false
    }

    @Test
    fun `o mesmo login em outra instituição não é conflito`() {
        val idFag = criarTenant(identifier = "fag", title = "FAG")
        val idOutra = criarTenant(identifier = "outra", title = "Outra")
        criarConta(idFag, login = "ana", email = "ana@fag.edu.br")

        val resposta = rest.getForEntity(
            "$loginOuEmail?id-tenant=$idOutra&login=ana&email=ana@outra.edu.br", Boolean::class.java,
        )

        resposta.body shouldBe false
    }

    @Test
    fun `atualizar conta troca os dados e mantém a senha quando ela vem em branco`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "ana", senha = "SenhaOriginal")

        val resposta = rest.postJson<Void>(
            "/api/entity-account/update/$idConta",
            UpsertAccountDto(idTenant, "ana.nova@fag.edu.br", "ana2", "", "Ana Maria", "Souza Lima"),
        )

        resposta.statusCode shouldBe HttpStatus.OK

        val linha = jdbc.queryForMap("SELECT * FROM account WHERE id = ?", idConta)
        linha["login"] shouldBe "ana2"
        linha["email"] shouldBe "ana.nova@fag.edu.br"
        linha["first_name"] shouldBe "Ana Maria"
        // Senha em branco significa "não mexer na senha".
        linha["password"] shouldBe "SenhaOriginal"
    }

    @Test
    fun `atualizar conta com senha nova grava a senha nova`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "ana", senha = "SenhaOriginal")

        rest.postJson<Void>(
            "/api/entity-account/update/$idConta",
            UpsertAccountDto(idTenant, "ana@fag.edu.br", "ana", "SenhaNova456", "Ana", "Souza"),
        )

        jdbc.queryForObject(
            "SELECT password FROM account WHERE id = ?", String::class.java, idConta,
        ) shouldBe "SenhaNova456"
    }

    @Test
    fun `membros de um evento são listados pela conta`() {
        val idTenant = criarTenant()
        val idEvento = criarEvento(idTenant, "Startup Garage")
        val idAna = criarConta(idTenant, login = "ana", primeiroNome = "Ana")
        val idBruno = criarConta(idTenant, login = "bruno", primeiroNome = "Bruno")
        criarConta(idTenant, login = "carla") // não participa do evento
        vincularContaAoEvento(idAna, idEvento)
        vincularContaAoEvento(idBruno, idEvento)

        val lista = rest.postForList<AccountDto>(
            "/api/entity-account/list-accounts-by-event?id-event=$idEvento",
        )

        lista.statusCode shouldBe HttpStatus.OK
        lista.body.shouldNotBeNull().map { it.login } shouldContainExactlyInAnyOrder listOf("ana", "bruno")
    }

    @Test
    fun `excluir conta remove a linha do banco`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "ana")

        val resposta = rest.exchange(
            "/api/entity-delete-by-id/delete-account/$idConta",
            org.springframework.http.HttpMethod.DELETE,
            null,
            Void::class.java,
        )

        resposta.statusCode shouldBe HttpStatus.OK
        contarLinhas("account", "id = ?", idConta) shouldBe 0
    }
}
