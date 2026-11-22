package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.integration.support.postSemCorpo
import br.com.synergia.libs.entityNote.models.UpsertNoteDto
import br.com.synergia.libs.entityPost.models.InsertPostDto
import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsCommons.enums.NoteTypeEnum
import br.com.synergia.libs.utilsCommons.enums.PostEntitiesEnum
import br.com.synergia.libs.utilsEntities.models.FeedItemDto
import br.com.synergia.libs.utilsEntities.models.NoteItemDto
import br.com.synergia.libs.utilsEntities.models.NotificationDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus

/** Integração do sino (notificações) e do feed "Novidades" do dashboard. */
@DisplayName("Integração: notificações e feed do dashboard")
class EntityNotificationIntegrationTest : IntegrationTestBase() {

    private val base = "/api/entity-notification"

    private fun postar(idConta: Long, idEvento: Long, titulo: String = "Aviso") =
        rest.postJson<Long>(
            "/api/entity-post/store",
            InsertPostDto(idConta, titulo, "Conteúdo", idEvento, PostEntitiesEnum.EVENT)
        ).body.shouldNotBeNull()

    private fun criarBlocoVinculado(
        idTenant: Long,
        idConta: Long,
        parent: NoteParentEnum,
        idParent: Long,
        tipo: NoteTypeEnum = NoteTypeEnum.LIST,
    ): Long {
        val idBloco = rest.postJson<Long>(
            "/api/entity-note/store",
            UpsertNoteDto(
                idTenant = idTenant,
                idAccount = idConta,
                type = tipo,
                title = "Checklist",
                content = "",
                items = listOf(NoteItemDto("Montar banca", false)),
                color = "padrao",
                pinned = false,
                archived = false,
            )
        ).body.shouldNotBeNull()
        rest.postSemCorpo<Void>(
            "/api/entity-note/attach/$idBloco?id-account=$idConta&parent-entity=$parent&parent-id=$idParent"
        ).statusCode shouldBe HttpStatus.OK
        return idBloco
    }

    private fun notificacoes(idConta: Long) =
        rest.postForList<NotificationDto>("$base/list-notifications-of-account?id-account=$idConta").body.shouldNotBeNull()

    private fun naoLidas(idConta: Long) =
        rest.postSemCorpo<Long>("$base/count-unread?id-account=$idConta").body.shouldNotBeNull()

    private fun feed(idConta: Long) =
        rest.postForList<FeedItemDto>("/api/page-dashboard/list-feed-of-account?id-account=$idConta").body.shouldNotBeNull()

    @Test
    fun `postagem do Organizador avisa os membros do evento e não o próprio autor`() {
        val idTenant = criarTenant()
        val idOrganizadora = criarConta(idTenant, login = "org")
        val idMembro = criarConta(idTenant, login = "membro")
        val idEvento = criarEvento(idTenant, "Feira")
        vincularContaAoEvento(idOrganizadora, idEvento, papel = "Organizador")
        vincularContaAoEvento(idMembro, idEvento, papel = "Participante")

        val idPost = postar(idOrganizadora, idEvento, titulo = "Credenciamento")

        val avisos = notificacoes(idMembro)
        avisos shouldHaveSize 1
        avisos[0].type shouldBe ActivityTypeEnum.POST
        avisos[0].parentEntity shouldBe NoteParentEnum.EVENT
        avisos[0].parentId shouldBe idEvento
        avisos[0].parentTitle shouldBe "Feira"
        avisos[0].referenceId shouldBe idPost
        avisos[0].referenceTitle shouldBe "Credenciamento"
        notificacoes(idOrganizadora).shouldBeEmpty()
    }

    @Test
    fun `postagem de quem não é Organizador não avisa ninguém`() {
        val idTenant = criarTenant()
        val idOrganizadora = criarConta(idTenant, login = "org")
        val idMembro = criarConta(idTenant, login = "membro")
        val idEvento = criarEvento(idTenant, "Feira")
        vincularContaAoEvento(idOrganizadora, idEvento, papel = "Organizador")
        vincularContaAoEvento(idMembro, idEvento, papel = "Participante")

        postar(idMembro, idEvento)

        contarLinhas("notification") shouldBe 0
    }

    @Test
    fun `lista do Organizador avisa também os membros dos projetos registrados no evento`() {
        val idTenant = criarTenant()
        val idOrganizadora = criarConta(idTenant, login = "org")
        val idAluno = criarConta(idTenant, login = "aluno")
        val idEvento = criarEvento(idTenant, "Feira")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoEvento(idOrganizadora, idEvento, papel = "Organizador")
        vincularContaAoProjeto(idAluno, idProjeto)
        jdbc.update("INSERT INTO project_event_relationship (id_project, id_event) VALUES (?, ?)", idProjeto, idEvento)

        criarBlocoVinculado(idTenant, idOrganizadora, NoteParentEnum.EVENT, idEvento, NoteTypeEnum.LIST)

        val avisos = notificacoes(idAluno)
        avisos shouldHaveSize 1
        avisos[0].type shouldBe ActivityTypeEnum.LIST
        avisos[0].referenceTitle shouldBe "Checklist"
    }

    @Test
    fun `nota do Líder avisa os membros do projeto`() {
        val idTenant = criarTenant()
        val idLider = criarConta(idTenant, login = "lider")
        val idMembro = criarConta(idTenant, login = "membro")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(idLider, idProjeto, papel = "Líder")
        vincularContaAoProjeto(idMembro, idProjeto)

        criarBlocoVinculado(idTenant, idLider, NoteParentEnum.PROJECT, idProjeto, NoteTypeEnum.TEXT)

        val avisos = notificacoes(idMembro)
        avisos shouldHaveSize 1
        avisos[0].type shouldBe ActivityTypeEnum.NOTE
        avisos[0].parentEntity shouldBe NoteParentEnum.PROJECT
    }

    @Test
    fun `marcar como lida zera o contador, uma por vez ou todas`() {
        val idTenant = criarTenant()
        val idOrganizadora = criarConta(idTenant, login = "org")
        val idMembro = criarConta(idTenant, login = "membro")
        val idEvento = criarEvento(idTenant, "Feira")
        vincularContaAoEvento(idOrganizadora, idEvento, papel = "Organizador")
        vincularContaAoEvento(idMembro, idEvento, papel = "Participante")
        postar(idOrganizadora, idEvento, titulo = "Um")
        postar(idOrganizadora, idEvento, titulo = "Dois")
        postar(idOrganizadora, idEvento, titulo = "Três")

        naoLidas(idMembro) shouldBe 3L

        val primeira = notificacoes(idMembro).first()
        rest.postSemCorpo<Void>("$base/mark-as-read/${primeira.id}?id-account=$idMembro").statusCode shouldBe HttpStatus.OK
        naoLidas(idMembro) shouldBe 2L
        notificacoes(idMembro).first().readAt.shouldNotBeNull()

        rest.postSemCorpo<Void>("$base/mark-all-as-read?id-account=$idMembro").statusCode shouldBe HttpStatus.OK
        naoLidas(idMembro) shouldBe 0L
    }

    @Test
    fun `não dá para marcar a notificação de outra pessoa`() {
        val idTenant = criarTenant()
        val idOrganizadora = criarConta(idTenant, login = "org")
        val idMembro = criarConta(idTenant, login = "membro")
        val idIntrusa = criarConta(idTenant, login = "intrusa")
        val idEvento = criarEvento(idTenant, "Feira")
        vincularContaAoEvento(idOrganizadora, idEvento, papel = "Organizador")
        vincularContaAoEvento(idMembro, idEvento, papel = "Participante")
        postar(idOrganizadora, idEvento)

        val aviso = notificacoes(idMembro).first()
        rest.postSemCorpo<Void>("$base/mark-as-read/${aviso.id}?id-account=$idIntrusa")
            .statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        naoLidas(idMembro) shouldBe 1L
    }

    @Test
    fun `apagar a postagem apaga os avisos dela`() {
        val idTenant = criarTenant()
        val idOrganizadora = criarConta(idTenant, login = "org")
        val idMembro = criarConta(idTenant, login = "membro")
        val idEvento = criarEvento(idTenant, "Feira")
        vincularContaAoEvento(idOrganizadora, idEvento, papel = "Organizador")
        vincularContaAoEvento(idMembro, idEvento, papel = "Participante")
        val idPost = postar(idOrganizadora, idEvento)

        rest.exchange(
            "/api/entity-post/delete/$idPost?id-account=$idOrganizadora", HttpMethod.DELETE, null, Void::class.java
        ).statusCode shouldBe HttpStatus.OK

        contarLinhas("notification") shouldBe 0
    }

    @Test
    fun `feed do dashboard junta postagens e blocos dos eventos e projetos da conta, do mais novo ao mais antigo`() {
        val idTenant = criarTenant()
        val idOrganizadora = criarConta(idTenant, login = "org")
        val idAluno = criarConta(idTenant, login = "aluno")
        val idEvento = criarEvento(idTenant, "Feira")
        val idOutroEvento = criarEvento(idTenant, "Outro")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoEvento(idOrganizadora, idEvento, papel = "Organizador")
        vincularContaAoEvento(idOrganizadora, idOutroEvento, papel = "Organizador")
        vincularContaAoEvento(idAluno, idEvento, papel = "Participante")
        vincularContaAoProjeto(idAluno, idProjeto, papel = "Líder")

        postar(idOrganizadora, idEvento, titulo = "Na feira")
        postar(idOrganizadora, idOutroEvento, titulo = "Em outro evento")
        criarBlocoVinculado(idTenant, idAluno, NoteParentEnum.PROJECT, idProjeto)

        val itens = feed(idAluno)
        itens.map { it.type } shouldBe listOf(ActivityTypeEnum.LIST, ActivityTypeEnum.POST)
        itens[0].parentTitle shouldBe "Robótica"
        itens[0].items shouldBe listOf(NoteItemDto("Montar banca", false))
        itens[1].title shouldBe "Na feira"
        itens[1].authorIsLead shouldBe true
    }
}
