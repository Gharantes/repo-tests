package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.libs.entityPost.models.InsertPostDto
import br.com.synergia.libs.entityPost.models.UpdatePostDto
import br.com.synergia.libs.utilsCommons.enums.PostEntitiesEnum
import br.com.synergia.libs.utilsEntities.models.PostDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus

/** Integração do feed do evento: postagens em Markdown com autor. */
@DisplayName("Integração: feed do evento")
class EntityPostIntegrationTest : IntegrationTestBase() {

    private val base = "/api/entity-post"

    private fun postar(idConta: Long, idEvento: Long, titulo: String = "Aviso", conteudo: String = "**Amanhã** às 9h") =
        rest.postJson<Long>(
            "$base/store",
            InsertPostDto(idConta, titulo, conteudo, idEvento, PostEntitiesEnum.EVENT)
        )

    private fun feed(idEvento: Long) =
        rest.postForList<PostDto>("$base/list-posts-of-event?id-event=$idEvento").body.shouldNotBeNull()

    @Test
    fun `postagem aparece no feed do evento com o nome do autor`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "autora")
        val idEvento = criarEvento(idTenant, "Feira")

        postar(idConta, idEvento).statusCode shouldBe HttpStatus.OK

        val posts = feed(idEvento)
        posts shouldHaveSize 1
        posts[0].idAccount shouldBe idConta
        posts[0].authorName.isNotBlank() shouldBe true
        posts[0].content shouldBe "**Amanhã** às 9h"
    }

    @Test
    fun `feed vem da mais nova para a mais antiga e só do evento pedido`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "autora")
        val idEvento = criarEvento(idTenant, "Feira")
        val idOutro = criarEvento(idTenant, "Outro")

        postar(idConta, idEvento, titulo = "Primeira")
        postar(idConta, idEvento, titulo = "Segunda")
        postar(idConta, idOutro, titulo = "De outro evento")

        feed(idEvento).map { it.title } shouldBe listOf("Segunda", "Primeira")
    }

    @Test
    fun `postagem vazia é recusada`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "autora")
        val idEvento = criarEvento(idTenant, "Feira")

        postar(idConta, idEvento, titulo = "  ", conteudo = "\n").statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        contarLinhas("post") shouldBe 0
    }

    @Test
    fun `evento de outro tenant é recusado sem deixar postagem solta`() {
        val idTenant = criarTenant()
        val idOutroTenant = criarTenant(identifier = "outro", title = "Outro")
        val idConta = criarConta(idTenant, login = "autora")
        val idEventoAlheio = criarEvento(idOutroTenant, "Alheio")

        postar(idConta, idEventoAlheio).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        contarLinhas("post") shouldBe 0
        contarLinhas("event_post_relationship") shouldBe 0
    }

    @Test
    fun `autor edita e apaga, outro usuário não`() {
        val idTenant = criarTenant()
        val idAutora = criarConta(idTenant, login = "autora")
        val idIntrusa = criarConta(idTenant, login = "intrusa")
        val idEvento = criarEvento(idTenant, "Feira")
        val idPost = postar(idAutora, idEvento).body.shouldNotBeNull()

        rest.postJson<Void>("$base/update/$idPost", UpdatePostDto(idIntrusa, "Invadido", "x"))
            .statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        rest.exchange("$base/delete/$idPost?id-account=$idIntrusa", HttpMethod.DELETE, null, Void::class.java)
            .statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        feed(idEvento)[0].title shouldBe "Aviso"

        rest.postJson<Void>("$base/update/$idPost", UpdatePostDto(idAutora, "Aviso novo", "![mapa](https://exemplo.com/mapa.png)"))
            .statusCode shouldBe HttpStatus.OK
        feed(idEvento)[0].title shouldBe "Aviso novo"

        rest.exchange("$base/delete/$idPost?id-account=$idAutora", HttpMethod.DELETE, null, Void::class.java)
            .statusCode shouldBe HttpStatus.OK
        feed(idEvento).shouldBeEmpty()
        contarLinhas("post") shouldBe 0
    }
}
