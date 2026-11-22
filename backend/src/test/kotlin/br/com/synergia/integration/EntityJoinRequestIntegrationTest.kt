package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postSemCorpo
import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
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

    private fun pedir(idProjeto: Long, idConta: Long) =
        rest.postSemCorpo<Long>("$base/request?id-project=$idProjeto&id-account=$idConta")

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
}
