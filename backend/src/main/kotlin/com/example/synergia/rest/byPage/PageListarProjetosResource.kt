package com.example.synergia.rest.byPage

import com.example.synergia.models.byPage.pageListarProjetos.dto.input.FiltroListarProjetosAllDto
import com.example.synergia.models.byPage.pageListarProjetos.dto.output.ListarProjetosAllDto
import com.example.synergia.services.byPage.PageListarProjetosService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/listar-projetos")
class PageListarProjetosResource (
    private val service: PageListarProjetosService
) {
    @PostMapping("/all")
    fun listarProjetosAll(
        @RequestBody params: FiltroListarProjetosAllDto
    ): ResponseEntity<List<ListarProjetosAllDto>> =
        ResponseMessenger.buildResponse {
            service.listarProjetosAll(params)
        }

    @DeleteMapping("/delete/{id}")
    fun deletarProjeto(
        @PathVariable("id") id: Long
    ): ResponseEntity<Void> = ResponseMessenger.responseWithoutReturn {
        service.deletarProjeto(id)
    }
}