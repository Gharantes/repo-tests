package br.com.synergia.rest

import br.com.synergia.pageExtendedProjeto.models.ProjectDetailsDto
import br.com.synergia.pageExtendedProjeto.services.PageExtendedProjetoService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/detalhes-projeto")
class PageExtendedProjetoResource (
    private val service: PageExtendedProjetoService
) {
    @GetMapping("/get/{id-projeto}")
    fun getExtendedProjetoDetailsById(
        @PathVariable("id-projeto") idProjeto: Long
    ): ResponseEntity<ProjectDetailsDto> {
        return ResponseMessenger.buildResponse {
            service.getExtendedProjetoDetailsById(idProjeto)
        }
    }
}