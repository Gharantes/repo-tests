package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.integration.support.postSemCorpo
import br.com.synergia.libs.entityNote.models.UpsertNoteDto
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsCommons.enums.NoteTypeEnum
import br.com.synergia.libs.utilsEntities.models.NoteDto
import br.com.synergia.libs.utilsEntities.models.NoteItemDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

/** Integração da lousa: blocos e o vínculo com um único projeto ou evento. */
@DisplayName("Integração: lousa")
class EntityNoteIntegrationTest : IntegrationTestBase() {

    private val base = "/api/entity-note"

    private fun bloco(idTenant: Long, idConta: Long, titulo: String = "Bloco", arquivado: Boolean = false) =
        UpsertNoteDto(
            idTenant = idTenant,
            idAccount = idConta,
            type = NoteTypeEnum.LIST,
            title = titulo,
            content = "",
            items = listOf(NoteItemDto("Comprar placa", true), NoteItemDto("Soldar", false)),
            color = "amarelo",
            pinned = false,
            archived = arquivado,
        )

    private fun criarBloco(idTenant: Long, idConta: Long): Long =
        rest.postJson<Long>("$base/store", bloco(idTenant, idConta)).body.shouldNotBeNull()

    @Test
    fun `bloco criado aparece na lousa do autor com os itens da lista`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "autora")
        criarBloco(idTenant, idConta)

        val blocos = rest.postForList<NoteDto>("$base/list-notes-by-account?id-account=$idConta").body.shouldNotBeNull()

        blocos shouldHaveSize 1
        blocos[0].items shouldBe listOf(NoteItemDto("Comprar placa", true), NoteItemDto("Soldar", false))
        blocos[0].parentEntity shouldBe null
    }

    @Test
    fun `vincular a um evento tira o bloco do projeto - um parente só`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "autora")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idEvento = criarEvento(idTenant, "Feira")
        val idBloco = criarBloco(idTenant, idConta)

        rest.postSemCorpo<Void>("$base/attach/$idBloco?id-account=$idConta&parent-entity=PROJECT&parent-id=$idProjeto")
            .statusCode shouldBe HttpStatus.OK
        rest.postForList<NoteDto>("$base/list-notes-of-project?id-project=$idProjeto").body.shouldNotBeNull() shouldHaveSize 1

        rest.postSemCorpo<Void>("$base/attach/$idBloco?id-account=$idConta&parent-entity=EVENT&parent-id=$idEvento")

        rest.postForList<NoteDto>("$base/list-notes-of-project?id-project=$idProjeto").body.shouldNotBeNull().shouldBeEmpty()
        val doEvento = rest.postForList<NoteDto>("$base/list-notes-of-event?id-event=$idEvento").body.shouldNotBeNull()
        doEvento shouldHaveSize 1
        doEvento[0].parentTitle shouldBe "Feira"
        contarLinhas("project_note_relationship") + contarLinhas("event_note_relationship") shouldBe 1
    }

    @Test
    fun `sem parent-entity o bloco é desvinculado`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "autora")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idBloco = criarBloco(idTenant, idConta)

        rest.postSemCorpo<Void>("$base/attach/$idBloco?id-account=$idConta&parent-entity=PROJECT&parent-id=$idProjeto")
        rest.postSemCorpo<Void>("$base/attach/$idBloco?id-account=$idConta")

        contarLinhas("project_note_relationship") shouldBe 0
    }

    @Test
    fun `projeto de outro tenant é recusado`() {
        val idTenant = criarTenant()
        val idOutroTenant = criarTenant(identifier = "outro", title = "Outro")
        val idConta = criarConta(idTenant, login = "autora")
        val idProjetoAlheio = criarProjeto(idOutroTenant, "Alheio")
        val idBloco = criarBloco(idTenant, idConta)

        rest.postSemCorpo<Void>("$base/attach/$idBloco?id-account=$idConta&parent-entity=PROJECT&parent-id=$idProjetoAlheio")
            .statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        contarLinhas("project_note_relationship") shouldBe 0
    }

    @Test
    fun `outro usuário não edita nem vincula o bloco`() {
        val idTenant = criarTenant()
        val idAutora = criarConta(idTenant, login = "autora")
        val idIntrusa = criarConta(idTenant, login = "intrusa")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idBloco = criarBloco(idTenant, idAutora)

        rest.postJson<Void>("$base/update/$idBloco", bloco(idTenant, idIntrusa, titulo = "Invadido"))
            .statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        rest.postSemCorpo<Void>("$base/attach/$idBloco?id-account=$idIntrusa&parent-entity=PROJECT&parent-id=$idProjeto")
            .statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        contarLinhas("note", "title = ?", "Bloco") shouldBe 1
        contarLinhas("project_note_relationship") shouldBe 0
    }

    @Test
    fun `bloco arquivado some da página do projeto mas fica na lousa do autor`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "autora")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idBloco = criarBloco(idTenant, idConta)
        rest.postSemCorpo<Void>("$base/attach/$idBloco?id-account=$idConta&parent-entity=PROJECT&parent-id=$idProjeto")

        rest.postJson<Void>("$base/update/$idBloco", bloco(idTenant, idConta, arquivado = true))

        rest.postForList<NoteDto>("$base/list-notes-of-project?id-project=$idProjeto").body.shouldNotBeNull().shouldBeEmpty()
        val daAutora = rest.postForList<NoteDto>("$base/list-notes-by-account?id-account=$idConta").body.shouldNotBeNull()
        daAutora[0].archivedAt.shouldNotBeNull()
    }

    @Test
    fun `apagar o bloco apaga o vínculo junto`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "autora")
        val idEvento = criarEvento(idTenant, "Feira")
        val idBloco = criarBloco(idTenant, idConta)
        rest.postSemCorpo<Void>("$base/attach/$idBloco?id-account=$idConta&parent-entity=EVENT&parent-id=$idEvento")

        rest.delete("$base/delete/$idBloco?id-account=$idConta")

        contarLinhas("note") shouldBe 0
        contarLinhas("event_note_relationship") shouldBe 0
    }
}
