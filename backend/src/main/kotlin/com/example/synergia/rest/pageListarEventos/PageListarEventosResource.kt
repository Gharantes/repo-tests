package com.example.synergia.rest.pageListarEventos

import com.example.synergia.rest.pageListarEventos.dto.input.FiltroListarEventosAllDto
import com.example.synergia.rest.pageListarEventos.dto.input.FiltroListarEventosByIdDto
import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosDto
import com.example.synergia.services.PageListarEventosService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/listar-eventos")
class PageListarEventosResource (
    private val service: PageListarEventosService
) {
    @PostMapping("/all")
    fun listarEventosAll(
        @RequestBody params: FiltroListarEventosAllDto
    ): ResponseEntity<List<ListarEventosDto>> =
        ResponseMessenger.buildResponse { service.listarEventosAll(params) }

    @PostMapping("/by-id")
    fun listarEventosById(
        @RequestBody params: FiltroListarEventosByIdDto
    ): ResponseEntity<ListarEventosDto> =
        ResponseMessenger.buildResponse { service.listarEventosById(params) }

    @DeleteMapping("/delete/{id}")
    fun deletarEvento(
        @PathVariable("id") id: Long
    ): ResponseEntity<Void> = ResponseMessenger.responseWithoutReturn {
        service.deletarEvento(id)
    }
}