package com.example.synergia.rest.pageCreateEvento

import com.example.synergia.rest.pageCreateEvento.dto.input.CreateEventoDto
import com.example.synergia.services.PageCreateEventoService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/create-evento")
class PageCreateEventoResource(
    private val service: PageCreateEventoService
) {
    @PostMapping("store")
    fun createEvento(
        @RequestBody params: CreateEventoDto
    ): ResponseEntity<Void> = ResponseMessenger.responseWithoutReturn {
        service.createEvento(params)
    }
}
