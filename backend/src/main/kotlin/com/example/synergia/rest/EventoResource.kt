package com.example.synergia.rest

import com.example.synergia.dto.EventoDto
import com.example.synergia.dto.UsuarioDto
import com.example.synergia.services.EventoService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/evento")
class EventoResource (
    private val eventoService: EventoService,
) {
    @GetMapping("getById/{idEvento}")
    fun getEventoById(
        @PathVariable("idEvento") idEvento: Long
    ): EventoDto? {
        return eventoService.getById(idEvento);
    }
    @GetMapping("getAll")
    fun getAllEvento(): List<EventoDto> {
        return eventoService.getAll();
    }
}