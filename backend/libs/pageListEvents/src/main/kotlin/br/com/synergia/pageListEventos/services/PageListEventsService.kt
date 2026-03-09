package br.com.synergia.pageListEventos.services

import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.services.EntityDeleteByIdService
import org.springframework.stereotype.Service

@Service
class PageListEventsService (
    private val sqlService: PageListEventsSqlService,
    private val deleteByIdService: EntityDeleteByIdService
) {
    fun listEvents(
        idTenant: Long,
        text: String? = null
    ): List<EventDto> {
        return sqlService.listEvents(idTenant, text)
    }
    fun deleteEvent(idEvent: Long) {
        deleteByIdService.deleteProjectEventRelationshipByIdEvent(idEvent)
        deleteByIdService.deleteEventById(idEvent)
    }
}