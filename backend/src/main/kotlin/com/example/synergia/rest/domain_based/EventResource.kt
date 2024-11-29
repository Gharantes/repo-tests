package com.example.synergia.rest.domain_based

import com.example.synergia.dto.entity_mirror.EventDto
import com.example.synergia.dto.input.EventCreateDto
import com.example.synergia.dto.input.EventUpdateDto
import com.example.synergia.services.EventService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/event")
class EventResource (
    private val eventService: EventService,
) {
    @GetMapping("get-by-id/{id_tenant}/{id}")
    fun getEventById(
        @PathVariable("id_tenant") idTenant: Long,
        @PathVariable("id") id: Long
    ): ResponseEntity<EventDto?> {
        return ResponseMessenger.buildResponse(null) {
            eventService.getById(idTenant, id);
        }
    }
    @GetMapping("get-all/{id_tenant}")
    fun getAllEvent(
        @PathVariable("id_tenant") idTenant: Long,
        @RequestParam("text_search", required = false) textSearch: String?
    ): ResponseEntity<List<EventDto>> {
        return ResponseMessenger.buildResponse(null) {
            eventService.getAll(idTenant, textSearch)
        }
    }
    @PostMapping("create-event")
    fun createEvent(
        @RequestBody eventCreateDto: EventCreateDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            eventService.createEvent(eventCreateDto);
            null
        }
    }
    @PostMapping("update-event")
    fun updateProject(
        @RequestBody eventUpdateDto: EventUpdateDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            eventService.updateEvent(eventUpdateDto);
            null
        }
    }
    @DeleteMapping("delete-event/{id_tenant}/{id}")
    fun deleteEvent(
        @PathVariable("id_tenant") idTenant: Long,
        @PathVariable("id") id: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            eventService.deleteEvent(idTenant, id);
            null
        }
    }
}
