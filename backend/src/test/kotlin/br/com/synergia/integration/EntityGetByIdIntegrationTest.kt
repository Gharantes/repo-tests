package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.libs.utilsEntities.models.AccountDto
import br.com.synergia.libs.utilsEntities.models.EventDto
import br.com.synergia.libs.utilsEntities.models.ProjectDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

/**
 * Integração da tela de detalhes (RF06).
 *
 * `get-project-by-id` é o endpoint que monta a página do projeto, e ele é
 * interessante porque compõe três consultas diferentes conforme os parâmetros
 * `lookup-tags` e `lookup-members`. Os testes verificam que cada bandeira liga
 * exatamente a consulta correspondente, e que sem elas nada extra é carregado.
 */
@DisplayName("Integração: detalhes por id")
class EntityGetByIdIntegrationTest : IntegrationTestBase() {

    @Test
    fun `detalhes do projeto trazem os campos próprios`() {
        val idTenant = criarTenant()
        val idProjeto = criarProjeto(idTenant, "Robótica Colaborativa", "Projeto para a Startup Garage.")

        val resposta = rest.getForEntity(
            "/api/entity-get-by-id/get-project-by-id/$idProjeto", ProjectDto::class.java,
        )

        resposta.statusCode shouldBe HttpStatus.OK
        val projeto = resposta.body.shouldNotBeNull()
        projeto.id shouldBe idProjeto
        projeto.title shouldBe "Robótica Colaborativa"
        projeto.description shouldBe "Projeto para a Startup Garage."
    }

    @Test
    fun `sem as bandeiras de lookup, tags e membros vêm vazios`() {
        val idTenant = criarTenant()
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularTagAoProjeto(criarTag(idTenant, "Design"), idProjeto)
        vincularContaAoProjeto(criarConta(idTenant, login = "ana"), idProjeto)

        val projeto = rest.getForEntity(
            "/api/entity-get-by-id/get-project-by-id/$idProjeto", ProjectDto::class.java,
        ).body.shouldNotBeNull()

        projeto.tags.shouldBeEmpty()
        projeto.members.shouldBeEmpty()
    }

    @Test
    fun `lookup-tags carrega as tags do projeto`() {
        val idTenant = criarTenant()
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularTagAoProjeto(criarTag(idTenant, "Design"), idProjeto)
        vincularTagAoProjeto(criarTag(idTenant, "TI"), idProjeto)

        val projeto = rest.getForEntity(
            "/api/entity-get-by-id/get-project-by-id/$idProjeto?lookup-tags=true", ProjectDto::class.java,
        ).body.shouldNotBeNull()

        projeto.tags.map { it.title } shouldContainExactlyInAnyOrder listOf("Design", "TI")
        projeto.members.shouldBeEmpty()
    }

    @Test
    fun `lookup-members carrega os integrantes do projeto`() {
        val idTenant = criarTenant()
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(criarConta(idTenant, login = "ana", primeiroNome = "Ana"), idProjeto, papel = "Líder")
        vincularContaAoProjeto(criarConta(idTenant, login = "bruno", primeiroNome = "Bruno"), idProjeto)
        criarConta(idTenant, login = "carla") // não é membro

        val projeto = rest.getForEntity(
            "/api/entity-get-by-id/get-project-by-id/$idProjeto?lookup-members=true", ProjectDto::class.java,
        ).body.shouldNotBeNull()

        projeto.members.map { it.login } shouldContainExactlyInAnyOrder listOf("ana", "bruno")
        projeto.tags.shouldBeEmpty()
    }

    @Test
    fun `as duas bandeiras juntas carregam tags e membros`() {
        val idTenant = criarTenant()
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularTagAoProjeto(criarTag(idTenant, "Design"), idProjeto)
        vincularContaAoProjeto(criarConta(idTenant, login = "ana"), idProjeto)

        val projeto = rest.getForEntity(
            "/api/entity-get-by-id/get-project-by-id/$idProjeto?lookup-tags=true&lookup-members=true",
            ProjectDto::class.java,
        ).body.shouldNotBeNull()

        projeto.tags shouldHaveSize 1
        projeto.members shouldHaveSize 1
    }

    @Test
    fun `projeto inexistente devolve 200 com corpo vazio`() {
        // Contrato atual: o controller usa `orElse(null)`, então some sem erro.
        val resposta = rest.getForEntity(
            "/api/entity-get-by-id/get-project-by-id/999999", ProjectDto::class.java,
        )

        resposta.statusCode shouldBe HttpStatus.OK
        resposta.body shouldBe null
    }

    @Test
    fun `detalhes da conta trazem os dados e não a senha`() {
        val idTenant = criarTenant()
        val idConta = criarConta(
            idTenant, login = "ana", senha = "SenhaSecreta", primeiroNome = "Ana",
            sobrenome = "Souza", email = "ana@fag.edu.br",
        )

        val resposta = rest.getForEntity(
            "/api/entity-get-by-id/get-account-by-id/$idConta", String::class.java,
        )

        resposta.statusCode shouldBe HttpStatus.OK
        val json = resposta.body.shouldNotBeNull()
        json.contains("\"login\":\"ana\"") shouldBe true
        // O JSON devolvido não pode carregar a senha para o navegador.
        json.contains("SenhaSecreta") shouldBe false
        json.contains("password") shouldBe false
    }

    @Test
    fun `detalhes da conta com lookup-tags trazem as áreas da pessoa`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "ana")
        vincularTagAConta(criarTag(idTenant, "Design", paraContas = true), idConta)

        val conta = rest.getForEntity(
            "/api/entity-get-by-id/get-account-by-id/$idConta?lookup-tags=true", AccountDto::class.java,
        ).body.shouldNotBeNull()

        conta.tags.map { it.title } shouldContainExactlyInAnyOrder listOf("Design")
    }

    @Test
    fun `detalhes do evento com membros trazem quem participa`() {
        val idTenant = criarTenant()
        val idEvento = criarEvento(idTenant, "Startup Garage")
        vincularContaAoEvento(criarConta(idTenant, login = "ana"), idEvento, papel = "Organizadora")
        vincularContaAoEvento(criarConta(idTenant, login = "bruno"), idEvento)

        val evento = rest.getForEntity(
            "/api/entity-get-by-id/get-event-by-id/$idEvento?lookup-members=true", EventDto::class.java,
        ).body.shouldNotBeNull()

        evento.title shouldBe "Startup Garage"
        evento.members.map { it.login } shouldContainExactlyInAnyOrder listOf("ana", "bruno")
    }
}
