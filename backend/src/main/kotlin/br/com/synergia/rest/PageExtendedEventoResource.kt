package br.com.synergia.rest

import br.com.synergia.pageExtendedEvento.models.ListarProjetosOfEventoDto
import br.com.synergia.pageExtendedEvento.services.PageExtendedEventoService
import br.com.synergia.utilsCommons.models.generic.GenericIdTextDto
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/page-extended-evento")
class PageExtendedEventoResource (
    private val service: PageExtendedEventoService
) {
    @PostMapping("/listar-projetos-do-evento")
    fun listarProjetosDoEvento(
        @RequestParam("id-evento") idEvento: Long
    ): ResponseEntity<List<ListarProjetosOfEventoDto>> {
        return ResponseMessenger.buildResponse {
            service.listarProjetosDoEvento(idEvento)
        }
    }
    @PostMapping("/listar-tags-do-evento")
    fun listarTagsDoEvento(
        @RequestParam("id-evento") idEvento: Long
    ): ResponseEntity<List<GenericIdTextDto>> {
        return ResponseMessenger.buildResponse {
            service.listarTagsDoEvento(idEvento)
        }
    }
}