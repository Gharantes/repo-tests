package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.libs.entityProject.models.UpsertProjectDto
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
 * Integração dos projetos (RF04, RF05, RF07, RF11).
 *
 * Tudo aqui passa pelo `list-projects-by-tenant.sql` e pelo trecho de filtro por
 * tag que o Kotlin concatena em tempo de execução. São coisas que só se pode
 * verificar com Postgres de verdade: `ILIKE` não existe fora do Postgres, e o
 * `HAVING COUNT(DISTINCT ...)` da filtragem por tag é o tipo de SQL que se
 * escreve errado com facilidade.
 */
@DisplayName("Integração: projetos")
class EntityProjectIntegrationTest : IntegrationTestBase() {

    private val store = "/api/entity-project/store"
    private val porTenant = "/api/entity-project/list-projects-by-tenant"
    private val porConta = "/api/entity-project/list-projects-by-account"

    @Test
    fun `criar projeto grava a linha, vincula o autor como Lider e liga as tags`() {
        val idTenant = criarTenant()
        val idAutor = criarConta(idTenant, login = "autora")
        val idTagDesign = criarTag(idTenant, "Design")
        val idTagTi = criarTag(idTenant, "TI")

        val resposta = rest.postJson<Void>(
            store,
            UpsertProjectDto(
                idTenant = idTenant,
                idAccount = idAutor,
                title = "Robótica Colaborativa",
                description = "Projeto para a Startup Garage 2026.",
                bannerUrl = null,
                tags = listOf(idTagDesign, idTagTi),
            ),
        )

        resposta.statusCode shouldBe HttpStatus.OK

        // Conferência direto no banco: o que importa é o que ficou persistido.
        contarLinhas("project", "title = ?", "Robótica Colaborativa") shouldBe 1

        val idProjeto = jdbc.queryForObject(
            "SELECT id FROM project WHERE title = ?", Long::class.java, "Robótica Colaborativa",
        )!!

        val papel = jdbc.queryForObject(
            "SELECT membership_label FROM project_account_relationship WHERE id_project = ? AND id_account = ?",
            String::class.java, idProjeto, idAutor,
        )
        papel shouldBe "Líder"

        val tagsGravadas = jdbc.queryForList(
            "SELECT id_tag FROM project_tag_relationship WHERE id_project = ?", Long::class.java, idProjeto,
        )
        tagsGravadas shouldContainExactlyInAnyOrder listOf(idTagDesign, idTagTi)
    }

    @Test
    fun `projeto criado aparece na listagem do tenant com os dados corretos`() {
        val idTenant = criarTenant()
        val idAutor = criarConta(idTenant, login = "autora")

        rest.postJson<Void>(
            store,
            UpsertProjectDto(idTenant, idAutor, "Horta Vertical", "Projeto de horta na faculdade.", null, emptyList()),
        )

        val lista = rest.postForList<ProjectDto>("$porTenant?id-tenant=$idTenant")

        lista.statusCode shouldBe HttpStatus.OK
        val projetos = lista.body.shouldNotBeNull()
        projetos shouldHaveSize 1
        projetos[0].title shouldBe "Horta Vertical"
        projetos[0].description shouldBe "Projeto de horta na faculdade."
        projetos[0].idTenant shouldBe idTenant
        // Uma cor de banner sempre é atribuída, mesmo sem o cliente mandar uma.
        Regex("^#[0-9A-F]{6}$").matches(projetos[0].bannerColor) shouldBe true
    }

    @Test
    fun `a busca por texto ignora maiúsculas e minúsculas`() {
        val idTenant = criarTenant()
        criarProjeto(idTenant, "Robótica Colaborativa")

        // ILIKE do Postgres: o mesmo termo em caixa diferente tem que achar.
        listOf("robótica", "ROBÓTICA", "RoBóTiCa").forEach { termo ->
            val lista = rest.postForList<ProjectDto>("$porTenant?id-tenant=$idTenant&text=$termo")
            lista.body.shouldNotBeNull() shouldHaveSize 1
        }
    }

    @Test
    fun `a busca por texto casa com pedaço do meio do título`() {
        val idTenant = criarTenant()
        criarProjeto(idTenant, "Feira de Ciências 2026")

        val lista = rest.postForList<ProjectDto>("$porTenant?id-tenant=$idTenant&text=Ciências")

        lista.body.shouldNotBeNull() shouldHaveSize 1
    }

    @Test
    fun `a busca por texto não traz o que não corresponde`() {
        val idTenant = criarTenant()
        criarProjeto(idTenant, "Robótica Colaborativa")
        criarProjeto(idTenant, "Horta Vertical")

        val lista = rest.postForList<ProjectDto>("$porTenant?id-tenant=$idTenant&text=Horta")

        val projetos = lista.body.shouldNotBeNull()
        projetos shouldHaveSize 1
        projetos[0].title shouldBe "Horta Vertical"
    }

    @Test
    fun `busca sem resultado devolve lista vazia, não erro`() {
        val idTenant = criarTenant()
        criarProjeto(idTenant, "Robótica Colaborativa")

        val lista = rest.postForList<ProjectDto>("$porTenant?id-tenant=$idTenant&text=Astronomia")

        lista.statusCode shouldBe HttpStatus.OK
        lista.body.shouldNotBeNull().shouldBeEmpty()
    }

    @Test
    fun `um projeto de outra instituição não aparece na listagem`() {
        // Isolamento por tenant: o aluno só enxerga projetos da própria faculdade.
        val idFag = criarTenant(identifier = "fag", title = "FAG")
        val idOutra = criarTenant(identifier = "outra", title = "Outra Faculdade")
        criarProjeto(idFag, "Projeto da FAG")
        criarProjeto(idOutra, "Projeto da Outra")

        val lista = rest.postForList<ProjectDto>("$porTenant?id-tenant=$idFag")

        val projetos = lista.body.shouldNotBeNull()
        projetos shouldHaveSize 1
        projetos[0].title shouldBe "Projeto da FAG"
    }

    @Test
    fun `o filtro por tags exige que o projeto tenha todas as tags pedidas`() {
        val idTenant = criarTenant()
        val idDesign = criarTag(idTenant, "Design")
        val idTi = criarTag(idTenant, "TI")

        val comAsDuas = criarProjeto(idTenant, "Projeto Completo")
        vincularTagAoProjeto(idDesign, comAsDuas)
        vincularTagAoProjeto(idTi, comAsDuas)

        val soDesign = criarProjeto(idTenant, "Projeto Só Design")
        vincularTagAoProjeto(idDesign, soDesign)

        criarProjeto(idTenant, "Projeto Sem Tag")

        // Só Design: pega os dois que têm Design.
        val porDesign = rest.postForList<ProjectDto>("$porTenant?id-tenant=$idTenant&tag-ids=$idDesign")
        porDesign.body.shouldNotBeNull().map { it.title } shouldContainExactlyInAnyOrder
            listOf("Projeto Completo", "Projeto Só Design")

        // Design E TI: só o que tem as duas. É o HAVING COUNT(DISTINCT) do SQL.
        val porAmbas = rest.postForList<ProjectDto>("$porTenant?id-tenant=$idTenant&tag-ids=$idDesign,$idTi")
        val resultado = porAmbas.body.shouldNotBeNull()
        resultado shouldHaveSize 1
        resultado[0].title shouldBe "Projeto Completo"
    }

    @Test
    fun `filtro por tag e por texto funcionam combinados`() {
        val idTenant = criarTenant()
        val idDesign = criarTag(idTenant, "Design")

        val alvo = criarProjeto(idTenant, "Robótica Colaborativa")
        vincularTagAoProjeto(idDesign, alvo)
        val outro = criarProjeto(idTenant, "Horta Vertical")
        vincularTagAoProjeto(idDesign, outro)

        val lista = rest.postForList<ProjectDto>(
            "$porTenant?id-tenant=$idTenant&text=Robótica&tag-ids=$idDesign",
        )

        val projetos = lista.body.shouldNotBeNull()
        projetos shouldHaveSize 1
        projetos[0].title shouldBe "Robótica Colaborativa"
    }

    @Test
    fun `meus projetos traz só aqueles em que a conta está vinculada`() {
        val idTenant = criarTenant()
        val idAna = criarConta(idTenant, login = "ana")
        val idBruno = criarConta(idTenant, login = "bruno")

        val projetoDaAna = criarProjeto(idTenant, "Projeto da Ana")
        vincularContaAoProjeto(idAna, projetoDaAna, papel = "Líder")

        val projetoCompartilhado = criarProjeto(idTenant, "Projeto Compartilhado")
        vincularContaAoProjeto(idAna, projetoCompartilhado)
        vincularContaAoProjeto(idBruno, projetoCompartilhado)

        val projetoDoBruno = criarProjeto(idTenant, "Projeto do Bruno")
        vincularContaAoProjeto(idBruno, projetoDoBruno)

        val daAna = rest.postForList<ProjectDto>("$porConta?id-account=$idAna")

        daAna.body.shouldNotBeNull().map { it.title } shouldContainExactlyInAnyOrder
            listOf("Projeto da Ana", "Projeto Compartilhado")
    }

    @Test
    fun `meus projetos aceita busca por texto junto`() {
        val idTenant = criarTenant()
        val idAna = criarConta(idTenant, login = "ana")
        val a = criarProjeto(idTenant, "Robótica Colaborativa")
        val b = criarProjeto(idTenant, "Horta Vertical")
        vincularContaAoProjeto(idAna, a)
        vincularContaAoProjeto(idAna, b)

        val lista = rest.postForList<ProjectDto>("$porConta?id-account=$idAna&text=horta")

        val projetos = lista.body.shouldNotBeNull()
        projetos shouldHaveSize 1
        projetos[0].title shouldBe "Horta Vertical"
    }

    @Test
    fun `atualizar projeto troca título, descrição e substitui as tags`() {
        val idTenant = criarTenant()
        val idAutor = criarConta(idTenant, login = "autora")
        val idDesign = criarTag(idTenant, "Design")
        val idTi = criarTag(idTenant, "TI")
        val idBio = criarTag(idTenant, "Biologia")

        val idProjeto = criarProjeto(idTenant, "Título Antigo", "Descrição antiga.")
        vincularTagAoProjeto(idDesign, idProjeto)
        vincularTagAoProjeto(idTi, idProjeto)

        val resposta = rest.postJson<Void>(
            "/api/entity-project/update/$idProjeto",
            UpsertProjectDto(idTenant, idAutor, "Título Novo", "Descrição nova.", null, listOf(idBio)),
        )

        resposta.statusCode shouldBe HttpStatus.OK

        val linha = jdbc.queryForMap("SELECT title, description FROM project WHERE id = ?", idProjeto)
        linha["title"] shouldBe "Título Novo"
        linha["description"] shouldBe "Descrição nova."

        // As tags antigas saem e só a nova permanece.
        val tags = jdbc.queryForList(
            "SELECT id_tag FROM project_tag_relationship WHERE id_project = ?", Long::class.java, idProjeto,
        )
        tags shouldContainExactlyInAnyOrder listOf(idBio)
    }

    @Test
    fun `atualizar projeto inexistente devolve erro em vez de criar um novo`() {
        val idTenant = criarTenant()
        val idAutor = criarConta(idTenant, login = "autora")

        val resposta = rest.postJson<String>(
            "/api/entity-project/update/999999",
            UpsertProjectDto(idTenant, idAutor, "Fantasma", "Não deveria existir.", null, emptyList()),
        )

        resposta.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        resposta.headers["x-error"].shouldNotBeNull()
        contarLinhas("project") shouldBe 0
    }
}
