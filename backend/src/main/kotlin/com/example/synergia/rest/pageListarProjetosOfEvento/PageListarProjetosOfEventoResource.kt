package com.example.synergia.rest.pageListarProjetosOfEvento

import com.example.synergia.rest.pageListarProjetosOfEvento.dto.input.FiltroListarProjetosOfEventoDto
import com.example.synergia.rest.pageListarProjetosOfEvento.dto.output.ListarProjetosOfEventoDto
import com.example.synergia.services.PageListarProjetosOfEventoService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/listar-projetos-of-evento")
class PageListarProjetosOfEventoResource (
    private val service: PageListarProjetosOfEventoService
) {
    @PostMapping("/all")
    fun listarProjetosOfEvento(
        @RequestBody params: FiltroListarProjetosOfEventoDto
    ): ResponseEntity<List<ListarProjetosOfEventoDto>> =
        ResponseMessenger.buildResponse {
            service.listarProjetosOfEvento(params)
        }
}