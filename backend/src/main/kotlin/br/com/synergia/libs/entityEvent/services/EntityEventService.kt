package br.com.synergia.libs.entityEvent.services

import br.com.synergia.libs.entityEvent.models.UpsertEventDto
import br.com.synergia.libs.utilsEntities.models.EventDto
import org.springframework.stereotype.Service

@Service
class EntityEventService (
    private val sqlService: EntityEventSqlService
) {
    fun listEventsByTenant(
        idTenant: Long,
        text: String? = null,
        tagIds: List<Long>? = null
    ): List<EventDto> {
        return sqlService.listEventsByTenant(idTenant, text, tagIds)
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
        sqlService.createEventAccountRelationship(idEvent, params.idAccount)
        sqlService.createEventTagRelationship(idEvent, params.tags)
    }
    fun updateEvent(idEvent: Long, params: UpsertEventDto) {
        sqlService.updateEvent(idEvent, params)
        sqlService.deleteEventTagRelationshipByIdEvent(idEvent)
        sqlService.createEventTagRelationship(idEvent, params.tags)
    }
}