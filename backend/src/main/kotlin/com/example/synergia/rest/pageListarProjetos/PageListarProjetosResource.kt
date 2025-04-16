package com.example.synergia.rest.pageListarProjetos

import com.example.synergia.rest.pageListarProjetos.dto.input.FiltroListarProjetosAllDto
import com.example.synergia.rest.pageListarProjetos.dto.output.ListarProjetosBasicInfoDto
import com.example.synergia.services.PageListarProjetosService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/listar-projetos")
class PageListarProjetosResource (
    private val service: PageListarProjetosService
) {
    @PostMapping("/all")
    fun listarProjetosAll(
        @RequestBody params: FiltroListarProjetosAllDto
    ): ResponseEntity<List<ListarProjetosBasicInfoDto>> =
        ResponseMessenger.buildResponse {
            service.listarProjetosAll(params)
        }
}