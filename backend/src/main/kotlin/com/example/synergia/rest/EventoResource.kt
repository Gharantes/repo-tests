package com.example.synergia.rest

import com.example.synergia.utils.objects.ResponseMessenger
import com.example.synergia.dto.entity_mirror.EventoDto
import com.example.synergia.dto.entity_mirror.ProjetoDto
import com.example.synergia.dto.input.CreateEventoDto
import com.example.synergia.services.EventoService
import com.example.synergia.utils.objects.MediaTypes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/evento")
class EventoResource (
    private val eventService: EventoService,
) {
    @GetMapping("get-by-id/{id-system}/{id-event}")
    fun getEventById(
        @PathVariable("id-system") idSystem: Long,
        @PathVariable("id-event") idEvento: Long
    ): ResponseEntity<EventoDto?> {
        return ResponseMessenger.buildResponse(null) {
            eventService.getById(idEvento);
        }
    }
    @GetMapping("get-all/{id-system}")
    fun getAllEvent(
        @PathVariable("id-system") idSystem: Long
    ): ResponseEntity<List<EventoDto>> {
        return ResponseMessenger.buildResponse(null) {
            eventService.getAll();
        }
    }
    @GetMapping(
        "get-projects-of-event/{id-system}/{id-event}",
        produces = [MediaTypes.JSON]
    ) fun getProjectsOfEvent(
        @PathVariable("id-system") idSystem: Long,
        @PathVariable("id-event") idEvento: Long,
    ): ResponseEntity<List<ProjetoDto>> {
        return ResponseMessenger.buildResponse(null) {
            eventService.getProjetosOfEvento(idEvento);
        }
    }
    @PostMapping("create-event/{id-system}")
    fun createEvent(
        @PathVariable("id-system") idSystem: Long,
        @RequestBody createEventoDto: CreateEventoDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            eventService.createEvento(createEventoDto);
            null
        }
    }
    @DeleteMapping("delete-event/{id-system}/{id-event}")
    fun deleteEvent(
        @PathVariable("id-system") idSystem: Long,
        @PathVariable("id-event") idEvento: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            eventService.deleteEvento(idEvento);
            null
        }
    }
}
