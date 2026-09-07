package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.libs.entityEvent.models.UpsertEventDto
import br.com.synergia.libs.utilsEntities.models.EventDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

/**
 * Integração dos eventos.
 *
 * Mesma forma dos projetos: criação com vínculo do organizador, listagem com
 * busca por texto e filtro por tag exigindo todas as tags. O SQL de evento é
 * quase gêmeo do de projeto, e é justamente por isso que ele merece teste
 * próprio: mudanças em um costumam ser copiadas para o outro pela metade.
 */
@DisplayName("Integração: eventos")
class EntityEventIntegrationTest : IntegrationTestBase() {

    private val store = "/api/entity-event/store"
    private val porTenant = "/api/entity-event/list-events-by-tenant"
    private val porConta = "/api/entity-event/list-events-by-account"

    @Test
    fun `criar evento grava a linha, vincula o organizador e liga as tags`() {
        val idTenant = criarTenant()
        val idOrganizador = criarConta(idTenant, login = "organizadora")
        val idTag = criarTag(idTenant, "Palestra", paraProjetos = false, paraEventos = true)

        val resposta = rest.postJson<Void>(
            store,
            UpsertEventDto(idTenant, idOrganizador, "Startup Garage", "Maratona de projetos.", null, listOf(idTag)),
        )

        resposta.statusCode shouldBe HttpStatus.OK

        val idEvento = jdbc.queryForObject(
            "SELECT id FROM event WHERE title = ?", Long::class.java, "Startup Garage",
        )!!

        jdbc.queryForObject(
            "SELECT membership_label FROM event_account_relationship WHERE id_event = ? AND id_account = ?",
            String::class.java, idEvento, idOrganizador,
        ) shouldBe "Organizador"

        jdbc.queryForList(
            "SELECT id_tag FROM event_tag_relationship WHERE id_event = ?", Long::class.java, idEvento,
        ) shouldContainExactlyInAnyOrder listOf(idTag)
    }

    @Test
    fun `evento criado aparece na listagem do tenant`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "organizadora")

        rest.postJson<Void>(
            store,
            UpsertEventDto(idTenant, idConta, "Summit 2026", "Encontro anual.", null, emptyList()),
        )

        val lista = rest.postForList<EventDto>("$porTenant?id-tenant=$idTenant")

        val eventos = lista.body.shouldNotBeNull()
        eventos shouldHaveSize 1
        eventos[0].title shouldBe "Summit 2026"
        eventos[0].description shouldBe "Encontro anual."
    }

    @Test
    fun `a busca de evento por texto ignora maiúsculas e minúsculas`() {
        val idTenant = criarTenant()
        criarEvento(idTenant, "Startup Garage")
        criarEvento(idTenant, "Summit 2026")

        val lista = rest.postForList<EventDto>("$porTenant?id-tenant=$idTenant&text=startup")

        val eventos = lista.body.shouldNotBeNull()
        eventos shouldHaveSize 1
        eventos[0].title shouldBe "Startup Garage"
    }

    @Test
    fun `eventos de outra instituição não aparecem`() {
        val idFag = criarTenant(identifier = "fag", title = "FAG")
        val idOutra = criarTenant(identifier = "outra", title = "Outra")
        criarEvento(idFag, "Startup Garage")
        criarEvento(idOutra, "Evento da Outra")

        rest.postForList<EventDto>("$porTenant?id-tenant=$idFag")
            .body.shouldNotBeNull().map { it.title } shouldContainExactlyInAnyOrder listOf("Startup Garage")
    }

    @Test
    fun `o filtro por tags exige que o evento tenha todas as tags pedidas`() {
        val idTenant = criarTenant()
        val idPalestra = criarTag(idTenant, "Palestra", paraProjetos = false, paraEventos = true)
        val idOficina = criarTag(idTenant, "Oficina", paraProjetos = false, paraEventos = true)

        val comAsDuas = criarEvento(idTenant, "Evento Completo")
        jdbc.update("INSERT INTO event_tag_relationship (id_tag, id_event) VALUES (?, ?)", idPalestra, comAsDuas)
        jdbc.update("INSERT INTO event_tag_relationship (id_tag, id_event) VALUES (?, ?)", idOficina, comAsDuas)

        val soPalestra = criarEvento(idTenant, "Evento Só Palestra")
        jdbc.update("INSERT INTO event_tag_relationship (id_tag, id_event) VALUES (?, ?)", idPalestra, soPalestra)

        val lista = rest.postForList<EventDto>("$porTenant?id-tenant=$idTenant&tag-ids=$idPalestra,$idOficina")

        val eventos = lista.body.shouldNotBeNull()
        eventos shouldHaveSize 1
        eventos[0].title shouldBe "Evento Completo"
    }

    @Test
    fun `meus eventos traz só aqueles em que a conta está vinculada`() {
        val idTenant = criarTenant()
        val idAna = criarConta(idTenant, login = "ana")
        val idBruno = criarConta(idTenant, login = "bruno")

        val daAna = criarEvento(idTenant, "Evento da Ana")
        vincularContaAoEvento(idAna, daAna, papel = "Organizadora")
        val doBruno = criarEvento(idTenant, "Evento do Bruno")
        vincularContaAoEvento(idBruno, doBruno)

        rest.postForList<EventDto>("$porConta?id-account=$idAna")
            .body.shouldNotBeNull().map { it.title } shouldContainExactlyInAnyOrder listOf("Evento da Ana")
    }

    @Test
    fun `atualizar evento troca título, descrição e substitui as tags`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "organizadora")
        val idAntiga = criarTag(idTenant, "Palestra", paraProjetos = false, paraEventos = true)
        val idNova = criarTag(idTenant, "Oficina", paraProjetos = false, paraEventos = true)

        val idEvento = criarEvento(idTenant, "Título Antigo", "Descrição antiga.")
        jdbc.update("INSERT INTO event_tag_relationship (id_tag, id_event) VALUES (?, ?)", idAntiga, idEvento)

        val resposta = rest.postJson<Void>(
            "/api/entity-event/update/$idEvento",
            UpsertEventDto(idTenant, idConta, "Título Novo", "Descrição nova.", null, listOf(idNova)),
        )

        resposta.statusCode shouldBe HttpStatus.OK
        val linha = jdbc.queryForMap("SELECT title, description FROM event WHERE id = ?", idEvento)
        linha["title"] shouldBe "Título Novo"
        linha["description"] shouldBe "Descrição nova."

        jdbc.queryForList(
            "SELECT id_tag FROM event_tag_relationship WHERE id_event = ?", Long::class.java, idEvento,
        ) shouldContainExactlyInAnyOrder listOf(idNova)
    }

    @Test
    fun `listar eventos de um projeto ainda devolve vazio, porque o vínculo não foi implementado`() {
        // Documenta uma lacuna conhecida em vez de fingir cobertura.
        //
        // `EntityEventSqlService.listEventsByProject` tem corpo `return emptyList()`,
        // e o SQL correspondente (`list-events-of-project.sql`) consulta a tabela
        // `project_event_relationship`, que não existe no banco. Enquanto o vínculo
        // projeto <-> evento não for implementado, o contrato real do endpoint é
        // este: responde 200 com lista vazia. Se alguém implementar, este teste
        // falha e obriga a atualizar a expectativa - que é o comportamento
        // desejado para um teste de lacuna.
        val idTenant = criarTenant()
        val idProjeto = criarProjeto(idTenant, "Robótica")

        val lista = rest.postForList<EventDto>("/api/entity-event/list-events-by-project?id-project=$idProjeto")

        lista.statusCode shouldBe HttpStatus.OK
        lista.body.shouldNotBeNull().shouldBeEmpty()
    }
}
