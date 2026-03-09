package br.com.synergia.rest

import br.com.synergia.pageListEventos.models.FiltroListarEventosAllDto
import br.com.synergia.pageListEventos.services.PageListEventsService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.EventDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-list-events")
class PageListEventsResource (
    private val service: PageListEventsService
) {
    @PostMapping("/list-events")
    fun listEvents(
        @RequestBody params: FiltroListarEventosAllDto
    ): ResponseEntity<List<EventDto>> {
        return ResponseMessenger.buildResponse { service.listEvents(params) }
    }

    @DeleteMapping("/delete/{id}")
    fun deleteEvent(
        @PathVariable("id") id: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.deleteEvent(id)
        }
    }
}