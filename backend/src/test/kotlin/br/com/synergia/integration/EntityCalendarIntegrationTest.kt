package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.libs.entityCalendar.models.UpsertCalendarEntryDto
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship.ProjectEventRelationship
import br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship.ProjectEventRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.CalendarEntryDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import java.time.LocalDate

/** Integração do calendário: datas de projeto e evento, e as do evento aparecendo nos projetos dele. */
@DisplayName("Integração: calendário")
class EntityCalendarIntegrationTest : IntegrationTestBase() {

    private val base = "/api/entity-calendar"

    @Autowired
    private lateinit var projectEventRelationshipRepository: ProjectEventRelationshipRepository

    private fun data(idConta: Long, titulo: String = "Entrega", dia: LocalDate = LocalDate.of(2026, 12, 5)) =
        UpsertCalendarEntryDto(idAccount = idConta, date = dia, title = titulo, description = "Levar o protótipo.")

    private fun marcar(parent: NoteParentEnum, idParent: Long, corpo: UpsertCalendarEntryDto) =
        rest.postJson<Long>("$base/store?parent-entity=$parent&parent-id=$idParent", corpo)

    private fun doProjeto(idProjeto: Long) =
        rest.postForList<CalendarEntryDto>("$base/list-entries-of-project?id-project=$idProjeto").body.shouldNotBeNull()

    private fun doEvento(idEvento: Long) =
        rest.postForList<CalendarEntryDto>("$base/list-entries-of-event?id-event=$idEvento").body.shouldNotBeNull()

    @Test
    fun `membro do projeto marca uma data e ela aparece no calendário do projeto`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "membro")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(idConta, idProjeto)

        marcar(NoteParentEnum.PROJECT, idProjeto, data(idConta)).statusCode shouldBe HttpStatus.OK

        val datas = doProjeto(idProjeto)
        datas shouldHaveSize 1
        datas[0].date shouldBe LocalDate.of(2026, 12, 5)
        datas[0].title shouldBe "Entrega"
        datas[0].description shouldBe "Levar o protótipo."
        datas[0].parentEntity shouldBe NoteParentEnum.PROJECT
        datas[0].parentTitle shouldBe "Robótica"
    }

    @Test
    fun `quem não é membro não marca data`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "visitante")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idEvento = criarEvento(idTenant, "Feira")

        marcar(NoteParentEnum.PROJECT, idProjeto, data(idConta)).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        marcar(NoteParentEnum.EVENT, idEvento, data(idConta)).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        contarLinhas("calendar_entry") shouldBe 0
    }

    @Test
    fun `data sem título é recusada`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "membro")
        val idEvento = criarEvento(idTenant, "Feira")
        vincularContaAoEvento(idConta, idEvento)

        marcar(NoteParentEnum.EVENT, idEvento, data(idConta, titulo = "   ")).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        contarLinhas("calendar_entry") shouldBe 0
    }

    @Test
    fun `data do evento aparece nos projetos registrados nele, e a do projeto não sobe para o evento`() {
        val idTenant = criarTenant()
        val organizadora = criarConta(idTenant, login = "organizadora")
        val lider = criarConta(idTenant, login = "lider")
        val idEvento = criarEvento(idTenant, "Feira")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        val idOutroProjeto = criarProjeto(idTenant, "Horta")
        vincularContaAoEvento(organizadora, idEvento)
        vincularContaAoProjeto(lider, idProjeto)
        projectEventRelationshipRepository.save(ProjectEventRelationship(idProject = idProjeto, idEvent = idEvento))

        marcar(NoteParentEnum.EVENT, idEvento, data(organizadora, "Abertura", LocalDate.of(2026, 12, 1)))
        marcar(NoteParentEnum.PROJECT, idProjeto, data(lider, "Ensaio", LocalDate.of(2026, 11, 28)))

        val doEvento = doEvento(idEvento)
        doEvento.map { it.title } shouldBe listOf("Abertura")

        val doProjeto = doProjeto(idProjeto)
        doProjeto.map { it.title } shouldBe listOf("Ensaio", "Abertura")
        doProjeto[1].parentEntity shouldBe NoteParentEnum.EVENT
        doProjeto[1].parentId shouldBe idEvento
        doProjeto[1].parentTitle shouldBe "Feira"

        doProjeto(idOutroProjeto).shouldBeEmpty()
    }

    @Test
    fun `projeto que sai do evento deixa de ver as datas dele`() {
        val idTenant = criarTenant()
        val organizadora = criarConta(idTenant, login = "organizadora")
        val idEvento = criarEvento(idTenant, "Feira")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoEvento(organizadora, idEvento)
        projectEventRelationshipRepository.save(ProjectEventRelationship(idProject = idProjeto, idEvent = idEvento))
        marcar(NoteParentEnum.EVENT, idEvento, data(organizadora))
        doProjeto(idProjeto) shouldHaveSize 1

        projectEventRelationshipRepository.deleteByIdProjectAndIdEvent(idProjeto, idEvento)

        doProjeto(idProjeto).shouldBeEmpty()
    }

    @Test
    fun `qualquer membro edita e apaga - membro do projeto não mexe na data do evento`() {
        val idTenant = criarTenant()
        val autora = criarConta(idTenant, login = "autora")
        val colega = criarConta(idTenant, login = "colega")
        val lider = criarConta(idTenant, login = "lider")
        val idEvento = criarEvento(idTenant, "Feira")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoEvento(autora, idEvento)
        vincularContaAoEvento(colega, idEvento, papel = "Integrante")
        vincularContaAoProjeto(lider, idProjeto)
        projectEventRelationshipRepository.save(ProjectEventRelationship(idProject = idProjeto, idEvent = idEvento))
        val idData = marcar(NoteParentEnum.EVENT, idEvento, data(autora)).body.shouldNotBeNull()

        rest.postJson<Void>("$base/update/$idData", data(lider, "Hackeado")).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        rest.postJson<Void>("$base/update/$idData", data(colega, "Entrega final", LocalDate.of(2026, 12, 10)))
            .statusCode shouldBe HttpStatus.OK
        val editada = doEvento(idEvento).single()
        editada.title shouldBe "Entrega final"
        editada.date shouldBe LocalDate.of(2026, 12, 10)
        editada.idAccount shouldBe autora

        rest.delete("$base/delete/$idData?id-account=$lider")
        contarLinhas("calendar_entry") shouldBe 1
        rest.delete("$base/delete/$idData?id-account=$colega")
        contarLinhas("calendar_entry") shouldBe 0
    }
}
