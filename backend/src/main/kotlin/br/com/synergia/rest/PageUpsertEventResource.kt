package br.com.synergia.rest

import br.com.synergia.pageUpsertEvents.models.UpsertEventDto
import br.com.synergia.pageUpsertEvents.services.PageUpsertEventService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/upsert-event")
class PageUpsertEventResource(
    private val service: PageUpsertEventService
) {
    @PostMapping("store")
    fun createEvent(
        @RequestBody params: UpsertEventDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.createEvent(params)
        }
    }
    @PostMapping("update/{id-event}")
    fun updateEvent(
        @PathVariable("id-event") idEvent: Long,
        @RequestBody params: UpsertEventDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updateEvent(idEvent, params)
        }
    }
}
