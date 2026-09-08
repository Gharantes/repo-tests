package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.getForList
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.libs.entityTag.models.UpsertTagDto
import br.com.synergia.libs.utilsEntities.models.TagDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

/**
 * Integração das tags (áreas/cursos).
 *
 * As tags são o que sustenta o filtro por área do RF05, e a listagem tem um SQL
 * com três condições em cadeia (`:for_projects IS FALSE OR for_projects IS TRUE`)
 * cujo comportamento não é óbvio de ler. Estes testes fixam o que ele realmente
 * faz contra o Postgres.
 */
@DisplayName("Integração: tags")
class EntityTagIntegrationTest : IntegrationTestBase() {

    private val criar = "/api/entity-tag/create-tag"
    private val listar = "/api/entity-tag/list-tags-by-tenant"

    @Test
    fun `criar tag grava a linha com as três flags de uso`() {
        val idTenant = criarTenant()

        val resposta = rest.postJson<Void>(
            criar,
            UpsertTagDto(idTenant, "Design", forProjects = true, forEvents = false, forAccounts = true),
        )

        resposta.statusCode shouldBe HttpStatus.OK
        val linha = jdbc.queryForMap("SELECT * FROM tags WHERE title = ?", "Design")
        linha["for_projects"] shouldBe true
        linha["for_events"] shouldBe false
        linha["for_accounts"] shouldBe true
        linha["created_at"].shouldNotBeNull()
    }

    @Test
    fun `listar sem exigir nenhuma flag traz todas as tags do tenant`() {
        val idTenant = criarTenant()
        criarTag(idTenant, "Design", paraProjetos = true)
        criarTag(idTenant, "Palestra", paraProjetos = false, paraEventos = true)

        val lista = rest.postForList<TagDto>(
            "$listar?id-tenant=$idTenant&for-projects=false&for-events=false&for-accounts=false",
        )

        lista.body.shouldNotBeNull().map { it.title } shouldContainExactlyInAnyOrder listOf("Design", "Palestra")
    }

    @Test
    fun `exigir for-projects traz só as tags marcadas para projeto`() {
        val idTenant = criarTenant()
        criarTag(idTenant, "Design", paraProjetos = true)
        criarTag(idTenant, "Palestra", paraProjetos = false, paraEventos = true)

        val lista = rest.postForList<TagDto>(
            "$listar?id-tenant=$idTenant&for-projects=true&for-events=false&for-accounts=false",
        )

        val tags = lista.body.shouldNotBeNull()
        tags shouldHaveSize 1
        tags[0].title shouldBe "Design"
    }

    @Test
    fun `tags de outra instituição não aparecem`() {
        val idFag = criarTenant(identifier = "fag", title = "FAG")
        val idOutra = criarTenant(identifier = "outra", title = "Outra")
        criarTag(idFag, "Design")
        criarTag(idOutra, "Design")

        val lista = rest.postForList<TagDto>(
            "$listar?id-tenant=$idFag&for-projects=false&for-events=false&for-accounts=false",
        )

        lista.body.shouldNotBeNull() shouldHaveSize 1
    }

    @Test
    fun `a busca de tag por texto ignora maiúsculas e minúsculas`() {
        val idTenant = criarTenant()
        criarTag(idTenant, "Biologia")
        criarTag(idTenant, "Design")

        rest.postForList<TagDto>(
            "$listar?id-tenant=$idTenant&for-projects=false&for-events=false&for-accounts=false&text=BIO",
        ).body.shouldNotBeNull().let {
            it shouldHaveSize 1
            it[0].title shouldBe "Biologia"
        }
    }

    @Test
    fun `as tags de um projeto são listadas pelo vínculo`() {
        val idTenant = criarTenant()
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idDesign = criarTag(idTenant, "Design")
        val idTi = criarTag(idTenant, "TI")
        criarTag(idTenant, "Biologia") // existe, mas não está no projeto
        vincularTagAoProjeto(idDesign, idProjeto)
        vincularTagAoProjeto(idTi, idProjeto)

        val lista = rest.getForList<TagDto>("/api/entity-tag/list-tags-by-project?id-project=$idProjeto")

        lista.statusCode shouldBe HttpStatus.OK
        lista.body.shouldNotBeNull().map { it.title } shouldContainExactlyInAnyOrder listOf("Design", "TI")
    }

    @Test
    fun `projeto sem tag devolve lista vazia`() {
        val idTenant = criarTenant()
        val idProjeto = criarProjeto(idTenant, "Robótica")

        rest.getForList<TagDto>("/api/entity-tag/list-tags-by-project?id-project=$idProjeto")
            .body.shouldNotBeNull().shouldBeEmpty()
    }

    @Test
    fun `atualizar tag muda o título e as flags`() {
        val idTenant = criarTenant()
        val idTag = criarTag(idTenant, "Desing", paraProjetos = true, paraEventos = false)

        val resposta = rest.postJson<Void>(
            "/api/entity-tag/update-tag/$idTag",
            UpsertTagDto(idTenant, "Design", forProjects = true, forEvents = true, forAccounts = false),
        )

        resposta.statusCode shouldBe HttpStatus.OK
        val linha = jdbc.queryForMap("SELECT title, for_events FROM tags WHERE id = ?", idTag)
        linha["title"] shouldBe "Design"
        linha["for_events"] shouldBe true
    }

    @Test
    fun `buscar tag por id devolve a tag`() {
        val idTenant = criarTenant()
        val idTag = criarTag(idTenant, "Design")

        val resposta = rest.getForEntity("/api/entity-get-by-id/get-tag-by-id/$idTag", TagDto::class.java)

        resposta.statusCode shouldBe HttpStatus.OK
        resposta.body.shouldNotBeNull().title shouldBe "Design"
    }

    @Test
    fun `excluir tag remove a linha`() {
        val idTenant = criarTenant()
        val idTag = criarTag(idTenant, "Design")

        val resposta = rest.getForEntity("/api/entity-delete-by-id/delete-tag-by-id/$idTag", Void::class.java)

        resposta.statusCode shouldBe HttpStatus.OK
        contarLinhas("tags", "id = ?", idTag) shouldBe 0
    }
}
