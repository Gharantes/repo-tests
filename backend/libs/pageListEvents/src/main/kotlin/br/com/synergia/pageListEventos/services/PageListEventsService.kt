package br.com.synergia.pageListEventos.services

import br.com.synergia.pageListEventos.models.FiltroListarEventosAllDto
import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.services.EntityDeleteByIdService
import org.springframework.stereotype.Service

@Service
class PageListEventsService (
    private val sqlService: PageListEventsSqlService,
    private val deleteByIdService: EntityDeleteByIdService
) {
    fun listEvents(
        params: FiltroListarEventosAllDto
    ): List<EventDto> {
        return sqlService.listEvents(params)
    }
    fun deleteEvent(idEvent: Long) {
        deleteByIdService.deleteProjectEventRelationshipByIdEvent(idEvent)
        deleteByIdService.deleteEventById(idEvent)
    }
}