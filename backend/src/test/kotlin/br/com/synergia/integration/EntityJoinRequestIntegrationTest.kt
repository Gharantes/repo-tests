package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.integration.support.postSemCorpo
import br.com.synergia.libs.entityJoinRequest.models.RequestToJoinDto
import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsCommons.enums.ConversationTypeEnum
import br.com.synergia.libs.utilsCommons.enums.JoinRequestStatusEnum
import br.com.synergia.libs.utilsEntities.models.ConversationDto
import br.com.synergia.libs.utilsEntities.models.MessageContactDto
import br.com.synergia.libs.utilsEntities.models.MessageDto
import br.com.synergia.libs.utilsEntities.models.NotificationDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

/** Integração do pedido para participar de um projeto. */
@DisplayName("Integração: pedido para participar de projeto")
class EntityJoinRequestIntegrationTest : IntegrationTestBase() {

    private val base = "/api/entity-join-request"

    private fun pedir(idProjeto: Long, idConta: Long, apresentacao: String = "Sei programar em Python e quero ajudar no robô.") =
        rest.postJson<Long>("$base/request?id-project=$idProjeto&id-account=$idConta", RequestToJoinDto(apresentacao))

    private fun pendente(idProjeto: Long, idConta: Long) =
        rest.postSemCorpo<Boolean>("$base/has-pending-request?id-project=$idProjeto&id-account=$idConta").body.shouldNotBeNull()

    private fun avisos(idConta: Long) =
        rest.postForList<NotificationDto>("/api/entity-notification/list-notifications-of-account?id-account=$idConta")
            .body.shouldNotBeNull()

    private fun membro(idProjeto: Long, idConta: Long) =
        contarLinhas("project_account_relationship", "id_project = ? AND id_account = ?", idProjeto, idConta) == 1

    @Test
    fun `pedido avisa todos os membros do projeto, uma vez só mesmo pedindo de novo`() {
        val idTenant = criarTenant()
        val lider = criarConta(idTenant, login = "lider")
        val integrante = criarConta(idTenant, login = "integrante")
        val interessada = criarConta(idTenant, login = "interessada", primeiroNome = "Ana", sobrenome = "Souza")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(lider, idProjeto, papel = "Líder")
        vincularContaAoProjeto(integrante, idProjeto)

        val idPedido = pedir(idProjeto, interessada).body.shouldNotBeNull()
        pedir(idProjeto, interessada).body shouldBe idPedido

        pendente(idProjeto, interessada) shouldBe true
        listOf(lider, integrante).forEach { idConta ->
            val lista = avisos(idConta)
            lista shouldHaveSize 1
            lista[0].type shouldBe ActivityTypeEnum.REQUEST
            lista[0].parentEntity shouldBe NoteParentEnum.PROJECT
            lista[0].parentId shouldBe idProjeto
            lista[0].parentTitle shouldBe "Robótica"
            lista[0].referenceId shouldBe idPedido
            lista[0].actorName shouldBe "Ana Souza"
        }
        avisos(interessada).shouldBeEmpty()
    }

    @Test
    fun `quem já é membro não pode pedir`() {
        val idTenant = criarTenant()
        val integrante = criarConta(idTenant, login = "integrante")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(integrante, idProjeto)

        pedir(idProjeto, integrante).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        contarLinhas("project_join_request") shouldBe 0
    }

    @Test
    fun `qualquer membro aceita, quem pediu vira Integrante e o aviso some para todos`() {
        val idTenant = criarTenant()
        val lider = criarConta(idTenant, login = "lider")
        val integrante = criarConta(idTenant, login = "integrante", primeiroNome = "Bruno", sobrenome = "Lima")
        val interessada = criarConta(idTenant, login = "interessada")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(lider, idProjeto, papel = "Líder")
        vincularContaAoProjeto(integrante, idProjeto)
        val idPedido = pedir(idProjeto, interessada).body.shouldNotBeNull()

        rest.postSemCorpo<Void>("$base/accept/$idPedido?id-account=$integrante").statusCode shouldBe HttpStatus.OK

        membro(idProjeto, interessada) shouldBe true
        contarLinhas("project_account_relationship", "id_account = ? AND membership_label = 'Integrante'", interessada) shouldBe 1
        pendente(idProjeto, interessada) shouldBe false
        avisos(lider).shouldBeEmpty()
        avisos(integrante).shouldBeEmpty()
        val daInteressada = avisos(interessada)
        daInteressada shouldHaveSize 1
        daInteressada[0].type shouldBe ActivityTypeEnum.ACCEPTED
        daInteressada[0].parentId shouldBe idProjeto
        daInteressada[0].actorName shouldBe "Bruno Lima"

        // O outro membro clica depois, com o aviso ainda aberto na tela.
        rest.postSemCorpo<Void>("$base/accept/$idPedido?id-account=$lider").statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
    }

    @Test
    fun `quem não é membro não responde ao pedido`() {
        val idTenant = criarTenant()
        val lider = criarConta(idTenant, login = "lider")
        val interessada = criarConta(idTenant, login = "interessada")
        val deFora = criarConta(idTenant, login = "defora")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(lider, idProjeto, papel = "Líder")
        val idPedido = pedir(idProjeto, interessada).body.shouldNotBeNull()

        rest.postSemCorpo<Void>("$base/accept/$idPedido?id-account=$deFora").statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        rest.postSemCorpo<Void>("$base/accept/$idPedido?id-account=$interessada").statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        membro(idProjeto, interessada) shouldBe false
        pendente(idProjeto, interessada) shouldBe true
    }

    @Test
    fun `recusar ou cancelar apaga o pedido e os avisos, sem virar membro`() {
        val idTenant = criarTenant()
        val lider = criarConta(idTenant, login = "lider")
        val interessada = criarConta(idTenant, login = "interessada")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(lider, idProjeto, papel = "Líder")

        val idPedido = pedir(idProjeto, interessada).body.shouldNotBeNull()
        rest.postSemCorpo<Void>("$base/decline/$idPedido?id-account=$lider").statusCode shouldBe HttpStatus.OK
        membro(idProjeto, interessada) shouldBe false
        pendente(idProjeto, interessada) shouldBe false
        avisos(lider).shouldBeEmpty()
        avisos(interessada).shouldBeEmpty()

        pedir(idProjeto, interessada).body.shouldNotBeNull()
        avisos(lider) shouldHaveSize 1
        rest.postSemCorpo<Void>("$base/cancel?id-project=$idProjeto&id-account=$interessada").statusCode shouldBe HttpStatus.OK
        pendente(idProjeto, interessada) shouldBe false
        avisos(lider).shouldBeEmpty()
    }

    // ---------------------------------------------------------------- apresentação no grupo do projeto

    private fun grupoDoProjeto(idConta: Long) =
        rest.postForList<ConversationDto>("/api/entity-message/list-conversations?id-account=$idConta").body.shouldNotBeNull()
            .single { it.type == ConversationTypeEnum.PROJECT }

    private fun mensagens(idConversa: Long, idConta: Long) =
        rest.postForList<MessageDto>("/api/entity-message/list-messages/$idConversa?id-account=$idConta")

    @Test
    fun `pedido sem apresentação é recusado`() {
        val idTenant = criarTenant()
        val lider = criarConta(idTenant, login = "lider")
        val interessada = criarConta(idTenant, login = "interessada")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(lider, idProjeto, papel = "Líder")

        pedir(idProjeto, interessada, apresentacao = "   ").statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        contarLinhas("project_join_request") shouldBe 0
        contarLinhas("conversation_message") shouldBe 0
    }

    @Test
    fun `a apresentação vai para o grupo do projeto como mensagem de futuro membro, sem dar acesso ao grupo`() {
        val idTenant = criarTenant()
        val lider = criarConta(idTenant, login = "lider")
        val interessada = criarConta(idTenant, login = "interessada", primeiroNome = "Ana", sobrenome = "Souza")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(lider, idProjeto, papel = "Líder")

        val idPedido = pedir(idProjeto, interessada, "  Quero cuidar da parte elétrica; já fiz curso de Arduino.  ").body.shouldNotBeNull()
        pedir(idProjeto, interessada, "Outra vez").body shouldBe idPedido

        val grupo = grupoDoProjeto(lider)
        grupo.unreadCount shouldBe 1
        val lista = mensagens(grupo.id, lider).body.shouldNotBeNull()
        lista shouldHaveSize 1
        lista[0].idAccount shouldBe interessada
        lista[0].authorName shouldBe "Ana Souza"
        lista[0].content shouldBe "Quero cuidar da parte elétrica; já fiz curso de Arduino."
        lista[0].idJoinRequest shouldBe idPedido
        lista[0].joinRequestStatus shouldBe JoinRequestStatusEnum.PENDING

        // Pedir não faz ninguém entrar no grupo.
        mensagens(grupo.id, interessada).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
    }

    @Test
    fun `aceitar e recusar ficam registrados na mensagem, e cancelar tira a mensagem do grupo`() {
        val idTenant = criarTenant()
        val lider = criarConta(idTenant, login = "lider")
        val aceita = criarConta(idTenant, login = "aceita")
        val recusado = criarConta(idTenant, login = "recusado")
        val desistiu = criarConta(idTenant, login = "desistiu")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(lider, idProjeto, papel = "Líder")

        val idAceito = pedir(idProjeto, aceita).body.shouldNotBeNull()
        val idRecusado = pedir(idProjeto, recusado).body.shouldNotBeNull()
        pedir(idProjeto, desistiu)

        rest.postSemCorpo<Void>("$base/accept/$idAceito?id-account=$lider").statusCode shouldBe HttpStatus.OK
        rest.postSemCorpo<Void>("$base/decline/$idRecusado?id-account=$lider").statusCode shouldBe HttpStatus.OK
        rest.postSemCorpo<Void>("$base/cancel?id-project=$idProjeto&id-account=$desistiu").statusCode shouldBe HttpStatus.OK

        val grupo = grupoDoProjeto(lider)
        val status = mensagens(grupo.id, lider).body.shouldNotBeNull().associate { it.idAccount to it.joinRequestStatus }
        status shouldBe mapOf(aceita to JoinRequestStatusEnum.ACCEPTED, recusado to JoinRequestStatusEnum.DECLINED)

        // Quem foi aceita agora lê o grupo, inclusive a própria apresentação.
        mensagens(grupo.id, aceita).body.shouldNotBeNull() shouldHaveSize 2
    }

    @Test
    fun `membros e quem pediu podem conversar em privado enquanto o pedido está pendente`() {
        val idTenant = criarTenant()
        val lider = criarConta(idTenant, login = "lider")
        val interessada = criarConta(idTenant, login = "interessada")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(lider, idProjeto, papel = "Líder")
        pedir(idProjeto, interessada)

        val contatos = rest.postForList<MessageContactDto>("/api/entity-message/list-contacts?id-account=$lider").body.shouldNotBeNull()
        contatos.single().idAccount shouldBe interessada
        contatos.single().membershipLabel shouldBe "Pediu para participar"
        rest.postSemCorpo<Long>("/api/entity-message/open-direct?id-account=$lider&id-other=$interessada").statusCode shouldBe HttpStatus.OK
        rest.postSemCorpo<Long>("/api/entity-message/open-direct?id-account=$interessada&id-other=$lider").statusCode shouldBe HttpStatus.OK
    }
}
