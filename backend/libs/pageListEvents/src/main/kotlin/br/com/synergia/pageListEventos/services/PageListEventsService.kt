package br.com.synergia.pageListEventos.services

import br.com.synergia.utilsEntities.models.EventDto
import org.springframework.stereotype.Service

@Service
class PageListEventsService (
    private val sqlService: PageListEventsSqlService,
) {
    fun listEvents(
        idTenant: Long,
        text: String? = null
    ): List<EventDto> {
        return sqlService.listEvents(idTenant, text)
    }
}