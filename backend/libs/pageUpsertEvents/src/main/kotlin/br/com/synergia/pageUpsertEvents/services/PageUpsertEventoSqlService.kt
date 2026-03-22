package br.com.synergia.pageUpsertEvents.services

import br.com.synergia.pageUpsertEvents.models.UpsertEventDto
import br.com.synergia.utilsEntities.jpa.event.Event
import br.com.synergia.utilsEntities.jpa.event.EventRepository
import org.springframework.stereotype.Service

@Service
class PageUpsertEventoSqlService (
    private val eventRepository: EventRepository
) {
    fun createEvent(params: UpsertEventDto) {
        val event = Event(
            idTenant = params.idTenant,
            title = params.title,
            description = params.description,
            bannerUrl = params.bannerUrl
        )
        eventRepository.save(event)
    }

    fun updateEvent(idEvent: Long, params: UpsertEventDto) {
        eventRepository.findById(idEvent).ifPresent { event ->
            event.title = params.title
            event.description = params.description
            event.bannerUrl = params.bannerUrl
            eventRepository.save(event)
        }
    }
}