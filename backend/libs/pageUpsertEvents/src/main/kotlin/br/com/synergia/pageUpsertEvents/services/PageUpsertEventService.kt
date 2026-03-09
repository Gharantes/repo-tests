package br.com.synergia.pageUpsertEvents.services

import br.com.synergia.pageUpsertEvents.models.UpsertEventDto
import org.springframework.stereotype.Service

@Service
class PageUpsertEventService (
    private val sqlService: PageUpsertEventoSqlService,
) {
    fun createEvent(params: UpsertEventDto) {
        return sqlService.createEvent(params)
    }
    fun updateEvent(idEvent: Long, params: UpsertEventDto) {
        return sqlService.updateEvent(idEvent, params)
    }
}