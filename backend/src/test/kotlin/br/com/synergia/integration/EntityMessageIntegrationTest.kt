package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.integration.support.postSemCorpo
import br.com.synergia.libs.entityMessage.models.SendMessageDto
import br.com.synergia.libs.utilsCommons.enums.ConversationTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship.ProjectEventRelationship
import br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship.ProjectEventRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.ConversationDto
import br.com.synergia.libs.utilsEntities.models.ConversationMemberDto
import br.com.synergia.libs.utilsEntities.models.MessageContactDto
import br.com.synergia.libs.utilsEntities.models.MessageDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus

/** Integração da tela Mensagens: grupo do projeto, conversa privada e grupo projeto + evento. */
@DisplayName("Integração: mensagens")
class EntityMessageIntegrationTest : IntegrationTestBase() {

    private val base = "/api/entity-message"

    @Autowired
    private lateinit var projectEventRelationshipRepository: ProjectEventRelationshipRepository

    private fun conversas(idConta: Long) =
        rest.postForList<ConversationDto>("$base/list-conversations?id-account=$idConta").body.shouldNotBeNull()

    private fun mensagens(idConversa: Long, idConta: Long, afterId: Long? = null) =
        rest.postForList<MessageDto>(
            "$base/list-messages/$idConversa?id-account=$idConta" + (afterId?.let { "&after-id=$it" } ?: "")
        )

    private fun enviar(idConversa: Long, idConta: Long, texto: String) =
        rest.postJson<MessageDto>("$base/send/$idConversa", SendMessageDto(idAccount = idConta, content = texto))

    private fun naoLidas(idConta: Long) = rest.postSemCorpo<Int>("$base/count-unread?id-account=$idConta").body.shouldNotBeNull()

    private fun membros(idConversa: Long, idConta: Long) =
        rest.postForList<ConversationMemberDto>("$base/list-members/$idConversa?id-account=$idConta").body.shouldNotBeNull()

    private fun registrar(idProjeto: Long, idEvento: Long) {
        projectEventRelationshipRepository.save(ProjectEventRelationship(idProject = idProjeto, idEvent = idEvento))
    }

    @Test
    fun `grupo do projeto aparece para todo membro, e quem é de fora não lê nem escreve`() {
        val idTenant = criarTenant()
        val ana = criarConta(idTenant, login = "ana")
        val bia = criarConta(idTenant, login = "bia")
        val deFora = criarConta(idTenant, login = "defora")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(ana, idProjeto, papel = "Líder")
        vincularContaAoProjeto(bia, idProjeto)

        val daAna = conversas(ana).single()
        daAna.type shouldBe ConversationTypeEnum.PROJECT
        daAna.projectTitle shouldBe "Robótica"

        enviar(daAna.id, ana, "  Reunião amanhã às 10h  ").statusCode shouldBe HttpStatus.OK

        val daBia = conversas(bia).single()
        daBia.id shouldBe daAna.id
        daBia.unreadCount shouldBe 1
        daBia.lastMessageContent shouldBe "Reunião amanhã às 10h"
        mensagens(daAna.id, bia).body.shouldNotBeNull().map { it.content } shouldBe listOf("Reunião amanhã às 10h")

        conversas(deFora).shouldBeEmpty()
        mensagens(daAna.id, deFora).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        enviar(daAna.id, deFora, "oi").statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        contarLinhas("conversation", "type = 'PROJECT'") shouldBe 1
    }

    @Test
    fun `mensagem vazia é recusada`() {
        val idTenant = criarTenant()
        val ana = criarConta(idTenant, login = "ana")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(ana, idProjeto)
        val idGrupo = conversas(ana).single().id

        enviar(idGrupo, ana, "   ").statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        contarLinhas("conversation_message") shouldBe 0
    }

    @Test
    fun `ler zera as não lidas, e as próprias mensagens nunca contam`() {
        val idTenant = criarTenant()
        val ana = criarConta(idTenant, login = "ana")
        val bia = criarConta(idTenant, login = "bia")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(ana, idProjeto)
        vincularContaAoProjeto(bia, idProjeto)
        val idGrupo = conversas(ana).single().id

        enviar(idGrupo, ana, "um")
        enviar(idGrupo, ana, "dois")
        naoLidas(ana) shouldBe 0
        naoLidas(bia) shouldBe 2

        rest.postSemCorpo<Void>("$base/mark-as-read/$idGrupo?id-account=$bia").statusCode shouldBe HttpStatus.OK
        naoLidas(bia) shouldBe 0
    }

    @Test
    fun `after-id traz só as mensagens novas`() {
        val idTenant = criarTenant()
        val ana = criarConta(idTenant, login = "ana")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(ana, idProjeto)
        val idGrupo = conversas(ana).single().id
        val primeira = enviar(idGrupo, ana, "um").body.shouldNotBeNull()
        enviar(idGrupo, ana, "dois")
        enviar(idGrupo, ana, "três")

        mensagens(idGrupo, ana, afterId = primeira.id).body.shouldNotBeNull().map { it.content } shouldBe listOf("dois", "três")
    }

    @Test
    fun `colegas de projeto conversam em privado, e a conversa não vaza para o grupo`() {
        val idTenant = criarTenant()
        val ana = criarConta(idTenant, login = "ana", primeiroNome = "Ana", sobrenome = "Souza")
        val bia = criarConta(idTenant, login = "bia", primeiroNome = "Bia", sobrenome = "Lima")
        val cris = criarConta(idTenant, login = "cris")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        listOf(ana, bia, cris).forEach { vincularContaAoProjeto(it, idProjeto) }

        val idPrivada = rest.postSemCorpo<Long>("$base/open-direct?id-account=$ana&id-other=$bia").body.shouldNotBeNull()
        // Abrir de novo, de qualquer lado, devolve a mesma conversa.
        rest.postSemCorpo<Long>("$base/open-direct?id-account=$bia&id-other=$ana").body shouldBe idPrivada

        // Sem mensagem, só aparece para quem abriu.
        conversas(ana).map { it.type } shouldContainExactlyInAnyOrder listOf(ConversationTypeEnum.PROJECT, ConversationTypeEnum.DIRECT)
        conversas(bia).map { it.type } shouldBe listOf(ConversationTypeEnum.PROJECT)

        enviar(idPrivada, ana, "Só entre nós")

        val privadaDaBia = conversas(bia).single { it.type == ConversationTypeEnum.DIRECT }
        privadaDaBia.otherAccountName shouldBe "Ana Souza"
        privadaDaBia.unreadCount shouldBe 1
        conversas(cris).map { it.type } shouldBe listOf(ConversationTypeEnum.PROJECT)
        mensagens(idPrivada, cris).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
    }

    @Test
    fun `conversa privada só com contatos`() {
        val idTenant = criarTenant()
        val ana = criarConta(idTenant, login = "ana")
        val estranho = criarConta(idTenant, login = "estranho")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idOutro = criarProjeto(idTenant, "Horta")
        vincularContaAoProjeto(ana, idProjeto)
        vincularContaAoProjeto(estranho, idOutro)

        rest.postSemCorpo<Long>("$base/open-direct?id-account=$ana&id-other=$estranho").statusCode shouldBe
            HttpStatus.INTERNAL_SERVER_ERROR
        rest.postSemCorpo<Long>("$base/open-direct?id-account=$ana&id-other=$ana").statusCode shouldBe
            HttpStatus.INTERNAL_SERVER_ERROR
        contarLinhas("conversation", "type = 'DIRECT'") shouldBe 0
    }

    @Test
    fun `membro do projeto conversa em privado com o organizador de um evento em que o projeto está`() {
        val idTenant = criarTenant()
        val ana = criarConta(idTenant, login = "ana")
        val organizador = criarConta(idTenant, login = "org", primeiroNome = "Olga", sobrenome = "Reis")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idEvento = criarEvento(idTenant, "Feira")
        val idOutroEvento = criarEvento(idTenant, "Congresso")
        val outroOrganizador = criarConta(idTenant, login = "org2")
        vincularContaAoProjeto(ana, idProjeto)
        vincularContaAoEvento(organizador, idEvento)
        vincularContaAoEvento(outroOrganizador, idOutroEvento)
        registrar(idProjeto, idEvento)

        val contatos = rest.postForList<MessageContactDto>("$base/list-contacts?id-account=$ana").body.shouldNotBeNull()
        contatos shouldHaveSize 1
        contatos[0].idAccount shouldBe organizador
        contatos[0].relation shouldBe NoteParentEnum.EVENT
        contatos[0].parentTitle shouldBe "Feira"
        contatos[0].membershipLabel shouldBe "Organizador"

        val idPrivada = rest.postSemCorpo<Long>("$base/open-direct?id-account=$ana&id-other=$organizador").body.shouldNotBeNull()
        enviar(idPrivada, ana, "Que horas abre a montagem?").statusCode shouldBe HttpStatus.OK
        enviar(idPrivada, organizador, "Às 8h.").statusCode shouldBe HttpStatus.OK
        mensagens(idPrivada, ana).body.shouldNotBeNull().map { it.content } shouldBe listOf("Que horas abre a montagem?", "Às 8h.")

        rest.postSemCorpo<Long>("$base/open-direct?id-account=$ana&id-other=$outroOrganizador").statusCode shouldBe
            HttpStatus.INTERNAL_SERVER_ERROR
    }

    @Test
    fun `grupo projeto + evento - membros do projeto adicionam o organizador e todos conversam`() {
        val idTenant = criarTenant()
        val ana = criarConta(idTenant, login = "ana")
        val bia = criarConta(idTenant, login = "bia")
        val organizador = criarConta(idTenant, login = "org")
        val ajudante = criarConta(idTenant, login = "ajudante")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idEvento = criarEvento(idTenant, "Feira")
        vincularContaAoProjeto(ana, idProjeto)
        vincularContaAoProjeto(bia, idProjeto)
        vincularContaAoEvento(organizador, idEvento)
        vincularContaAoEvento(ajudante, idEvento, papel = "Integrante")
        registrar(idProjeto, idEvento)

        val idGrupo = rest.postSemCorpo<Long>("$base/open-project-event?id-project=$idProjeto&id-event=$idEvento&id-account=$ana")
            .body.shouldNotBeNull()
        rest.postSemCorpo<Long>("$base/open-project-event?id-project=$idProjeto&id-event=$idEvento&id-account=$bia")
            .body shouldBe idGrupo

        // Antes de ser adicionado, o organizador não vê o grupo.
        conversas(organizador).shouldBeEmpty()
        mensagens(idGrupo, organizador).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        rest.postSemCorpo<Void>("$base/add-member/$idGrupo?id-account=$bia&id-member=$organizador").statusCode shouldBe HttpStatus.OK

        val doOrganizador = conversas(organizador).single()
        doOrganizador.type shouldBe ConversationTypeEnum.PROJECT_EVENT
        doOrganizador.projectTitle shouldBe "Robótica"
        doOrganizador.eventTitle shouldBe "Feira"

        enviar(idGrupo, ana, "Precisamos de uma tomada extra.")
        enviar(idGrupo, organizador, "Separo uma para vocês.")
        mensagens(idGrupo, bia).body.shouldNotBeNull() shouldHaveSize 2

        val participantes = membros(idGrupo, ana)
        participantes.map { it.idAccount } shouldContainExactlyInAnyOrder listOf(ana, bia, organizador)
        participantes.single { it.idAccount == organizador }.origin shouldBe NoteParentEnum.EVENT
        participantes.single { it.idAccount == organizador }.membershipLabel shouldBe "Organizador"

        // O ajudante continua de fora, e o grupo do projeto segue só do projeto.
        conversas(ajudante).shouldBeEmpty()
        val idGrupoProjeto = conversas(ana).single { it.type == ConversationTypeEnum.PROJECT }.id
        mensagens(idGrupoProjeto, organizador).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
    }

    @Test
    fun `grupo projeto + evento - regras de quem entra e quem tira`() {
        val idTenant = criarTenant()
        val ana = criarConta(idTenant, login = "ana")
        val organizador = criarConta(idTenant, login = "org")
        val deFora = criarConta(idTenant, login = "defora")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idEvento = criarEvento(idTenant, "Feira")
        val idEventoSemProjeto = criarEvento(idTenant, "Congresso")
        vincularContaAoProjeto(ana, idProjeto)
        vincularContaAoEvento(organizador, idEvento)
        registrar(idProjeto, idEvento)

        // Projeto fora do evento não abre grupo; quem não é do projeto também não.
        rest.postSemCorpo<Long>("$base/open-project-event?id-project=$idProjeto&id-event=$idEventoSemProjeto&id-account=$ana")
            .statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        rest.postSemCorpo<Long>("$base/open-project-event?id-project=$idProjeto&id-event=$idEvento&id-account=$organizador")
            .statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        val idGrupo = rest.postSemCorpo<Long>("$base/open-project-event?id-project=$idProjeto&id-event=$idEvento&id-account=$ana")
            .body.shouldNotBeNull()

        // Só gente do evento entra, e só membro do projeto adiciona.
        rest.postSemCorpo<Void>("$base/add-member/$idGrupo?id-account=$ana&id-member=$deFora").statusCode shouldBe
            HttpStatus.INTERNAL_SERVER_ERROR
        rest.postSemCorpo<Void>("$base/add-member/$idGrupo?id-account=$deFora&id-member=$organizador").statusCode shouldBe
            HttpStatus.INTERNAL_SERVER_ERROR
        rest.postSemCorpo<Void>("$base/add-member/$idGrupo?id-account=$ana&id-member=$organizador").statusCode shouldBe HttpStatus.OK

        // O próprio organizador pode sair.
        rest.postSemCorpo<Void>("$base/remove-member/$idGrupo?id-account=$organizador&id-member=$organizador").statusCode shouldBe
            HttpStatus.OK
        conversas(organizador).shouldBeEmpty()

        // O grupo do projeto não aceita pessoas adicionadas.
        val idGrupoProjeto = conversas(ana).single { it.type == ConversationTypeEnum.PROJECT }.id
        rest.postSemCorpo<Void>("$base/add-member/$idGrupoProjeto?id-account=$ana&id-member=$organizador").statusCode shouldBe
            HttpStatus.INTERNAL_SERVER_ERROR
    }
}
