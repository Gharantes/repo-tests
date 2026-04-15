package br.com.synergia.rest

import br.com.synergia.entityEvent.models.UpsertEventDto
import br.com.synergia.entityEvent.services.EntityEventService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.EventDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-post")
class EntityPostResource (
    private val service: EntityEventService
) {
    @PostMapping("/list-events-by-tenant")
    fun listEventsByTenant(
        @RequestParam("id-tenant") idTenant: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<EventDto>> {
        return ResponseMessenger.buildResponse {
            service.listEventsByTenant(idTenant, text)
        }
    }
    @PostMapping("/list-events-by-account")
    fun listEventsByAccount(
        @RequestParam("id-account") idAccount: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<EventDto>> {
        return ResponseMessenger.buildResponse {
            service.listEventsByAccount(idAccount, text)
        }
    }
    @PostMapping("/list-events-by-project")
    fun listEventsByProject(
        @RequestParam("id-project") idProject: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<EventDto>> {
        return ResponseMessenger.buildResponse {
            service.listEventsByProject(idProject, text)
        }
    }
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