package br.com.synergia.rest

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
        @RequestParam("id-tenant") idTenant: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<EventDto>> {
        return ResponseMessenger.buildResponse {
            service.listEvents(idTenant, text)
        }
    }
}