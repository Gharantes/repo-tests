package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postSemCorpo
import br.com.synergia.libs.utilsEntities.models.EventDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

/** Integração: registrar um projeto em eventos. */
@DisplayName("Integração: eventos do projeto")
class ProjectEventRelationshipIntegrationTest : IntegrationTestBase() {

    private val base = "/api/action-manage-relationships"

    private fun eventosDo(idProjeto: Long) =
        rest.postForList<EventDto>("$base/list-events-of-project?id-project=$idProjeto").body.shouldNotBeNull()

    @Test
    fun `projeto registrado aparece nos eventos e registrar de novo não duplica`() {
        val idTenant = criarTenant()
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idFeira = criarEvento(idTenant, "Feira")
        val idMostra = criarEvento(idTenant, "Mostra")

        rest.postSemCorpo<Void>("$base/create-relationship-event-and-project?id-event=$idFeira&id-project=$idProjeto")
            .statusCode shouldBe HttpStatus.OK
        rest.postSemCorpo<Void>("$base/create-relationship-event-and-project?id-event=$idMostra&id-project=$idProjeto")
        rest.postSemCorpo<Void>("$base/create-relationship-event-and-project?id-event=$idFeira&id-project=$idProjeto")
            .statusCode shouldBe HttpStatus.OK

        eventosDo(idProjeto).map { it.title } shouldBe listOf("Feira", "Mostra")
        contarLinhas("project_event_relationship") shouldBe 2
    }

    @Test
    fun `remover tira só aquele evento`() {
        val idTenant = criarTenant()
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idFeira = criarEvento(idTenant, "Feira")

        rest.postSemCorpo<Void>("$base/create-relationship-event-and-project?id-event=$idFeira&id-project=$idProjeto")
        rest.postSemCorpo<Void>("$base/remove-relationship-event-and-project?id-event=$idFeira&id-project=$idProjeto")
            .statusCode shouldBe HttpStatus.OK

        eventosDo(idProjeto).shouldBeEmpty()
    }

    @Test
    fun `evento de outro tenant é recusado`() {
        val idTenant = criarTenant()
        val idOutroTenant = criarTenant(identifier = "outro", title = "Outro")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idAlheio = criarEvento(idOutroTenant, "Alheio")

        rest.postSemCorpo<Void>("$base/create-relationship-event-and-project?id-event=$idAlheio&id-project=$idProjeto")
            .statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        contarLinhas("project_event_relationship") shouldBe 0
    }
}
