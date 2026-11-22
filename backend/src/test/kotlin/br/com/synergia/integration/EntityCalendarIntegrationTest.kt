package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.libs.entityCalendar.models.UpsertCalendarEntryDto
import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship.ProjectEventRelationship
import br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship.ProjectEventRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.CalendarEntryDto
import br.com.synergia.libs.utilsEntities.models.NotificationDto
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

    private fun avisos(idConta: Long) =
        rest.postForList<NotificationDto>("/api/entity-notification/list-notifications-of-account?id-account=$idConta")
            .body.shouldNotBeNull()

    @Test
    fun `data no projeto avisa os outros membros do projeto, mesmo quem marcou não sendo Líder`() {
        val idTenant = criarTenant()
        val integrante = criarConta(idTenant, login = "integrante")
        val colega = criarConta(idTenant, login = "colega")
        val deFora = criarConta(idTenant, login = "defora")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(integrante, idProjeto, papel = "Integrante")
        vincularContaAoProjeto(colega, idProjeto, papel = "Líder")

        val idData = marcar(NoteParentEnum.PROJECT, idProjeto, data(integrante, "Ensaio")).body.shouldNotBeNull()

        val doColega = avisos(colega)
        doColega shouldHaveSize 1
        doColega[0].type shouldBe ActivityTypeEnum.DATE
        doColega[0].parentEntity shouldBe NoteParentEnum.PROJECT
        doColega[0].parentId shouldBe idProjeto
        doColega[0].parentTitle shouldBe "Robótica"
        doColega[0].referenceId shouldBe idData
        doColega[0].referenceTitle shouldBe "Ensaio"
        avisos(integrante).shouldBeEmpty()
        avisos(deFora).shouldBeEmpty()
    }

    @Test
    fun `data no evento avisa os membros dos projetos registrados nele, uma vez por pessoa`() {
        val idTenant = criarTenant()
        val organizadora = criarConta(idTenant, login = "organizadora")
        val emDoisProjetos = criarConta(idTenant, login = "dupla")
        val soNoOutro = criarConta(idTenant, login = "outro")
        val idEvento = criarEvento(idTenant, "Feira")
        val idRobotica = criarProjeto(idTenant, "Robótica")
        val idHorta = criarProjeto(idTenant, "Horta")
        val idForaDoEvento = criarProjeto(idTenant, "Xadrez")
        vincularContaAoEvento(organizadora, idEvento)
        vincularContaAoProjeto(emDoisProjetos, idRobotica)
        vincularContaAoProjeto(emDoisProjetos, idHorta)
        vincularContaAoProjeto(soNoOutro, idForaDoEvento)
        projectEventRelationshipRepository.save(ProjectEventRelationship(idProject = idRobotica, idEvent = idEvento))
        projectEventRelationshipRepository.save(ProjectEventRelationship(idProject = idHorta, idEvent = idEvento))

        marcar(NoteParentEnum.EVENT, idEvento, data(organizadora, "Abertura"))

        val avisosDupla = avisos(emDoisProjetos)
        avisosDupla shouldHaveSize 1
        avisosDupla[0].parentEntity shouldBe NoteParentEnum.EVENT
        avisosDupla[0].parentTitle shouldBe "Feira"
        avisos(soNoOutro).shouldBeEmpty()
        avisos(organizadora).shouldBeEmpty()
    }

    @Test
    fun `apagar a data apaga os avisos dela`() {
        val idTenant = criarTenant()
        val autora = criarConta(idTenant, login = "autora")
        val colega = criarConta(idTenant, login = "colega")
        val idProjeto = criarProjeto(idTenant, "Robótica")
        vincularContaAoProjeto(autora, idProjeto)
        vincularContaAoProjeto(colega, idProjeto)
        val idData = marcar(NoteParentEnum.PROJECT, idProjeto, data(autora)).body.shouldNotBeNull()
        contarLinhas("notification") shouldBe 1

        rest.delete("$base/delete/$idData?id-account=$autora")

        contarLinhas("notification") shouldBe 0
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
