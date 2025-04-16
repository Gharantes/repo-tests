package com.example.synergia.rest.pageDetalhesEvento

import com.example.synergia.rest.pageDetalhesEvento.dto.input.FiltroListarProjetosOfEventoDto
import com.example.synergia.rest.pageDetalhesEvento.dto.output.ListarProjetosOfEventoDto
import com.example.synergia.services.PageDetalhesEvento
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/listar-projetos-of-evento")
class PageDetalhesEventoResource (
    private val service: PageDetalhesEvento
) {
    @PostMapping("/all")
    fun listarProjetosOfEvento(
        @RequestBody params: FiltroListarProjetosOfEventoDto
    ): ResponseEntity<List<ListarProjetosOfEventoDto>> =
        ResponseMessenger.buildResponse {
            service.listarProjetosOfEvento(params)
        }
}