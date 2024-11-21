package com.example.synergia.rest.domain_based

import com.example.synergia.utils.objects.ResponseMessenger
import com.example.synergia.dto.entity_mirror.EventDto
import com.example.synergia.dto.entity_mirror.ProjectDto
import com.example.synergia.dto.input.EventCreateDto
import com.example.synergia.services.EventService
import com.example.synergia.utils.objects.MediaTypes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

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
        @PathVariable("id_tenant") idTenant: Long
    ): ResponseEntity<List<EventDto>> {
        return ResponseMessenger.buildResponse(null) {
            eventService.getAll(idTenant);
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
