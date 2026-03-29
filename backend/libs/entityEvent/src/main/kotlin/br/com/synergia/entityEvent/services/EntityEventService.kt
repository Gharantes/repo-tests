package br.com.synergia.entityEvent.services

import br.com.synergia.entityEvent.models.UpsertEventDto
import br.com.synergia.utilsEntities.models.EventDto
import org.springframework.stereotype.Service

@Service
class EntityEventService (
    private val sqlService: EntityEventSqlService
) {
    fun listEventsByTenant(
        idTenant: Long,
        text: String? = null
    ): List<EventDto> {
        return sqlService.listEventsByTenant(idTenant, text)
    }
    fun listEventsByAccount(
        idAccount: Long,
        text: String? = null
    ): List<EventDto> {
        return sqlService.listEventsByAccount(idAccount, text)
    }
    fun listEventsByProject(
        idProject: Long,
        text: String? = null
    ): List<EventDto> {
        return sqlService.listEventsByProject(idProject, text)
    }
    fun createEvent(params: UpsertEventDto) {
        val idEvent = sqlService.createEvent(params)
        sqlService.createEventAccountRelationship(params.idAccount, idEvent)
    }
    fun updateEvent(idEvent: Long, params: UpsertEventDto) {
        return sqlService.updateEvent(idEvent, params)
    }
}