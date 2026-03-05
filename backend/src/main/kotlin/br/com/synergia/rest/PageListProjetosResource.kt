package br.com.synergia.rest

import br.com.synergia.pageListProjetos.services.PageListProjetosService
import br.com.synergia.utilsCommons.models.entities.ProjetoDto
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-list-projetos")
class PageListProjetosResource (
    private val service: PageListProjetosService
) {
    @PostMapping("/listar-projetos")
    fun listarProjetos(
        @RequestParam("idTenant") idTenant: Long,
        @RequestParam("idAccount") idAccount: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<ProjetoDto>> {
        return ResponseMessenger.buildResponse {
            service.listarProjetos(idTenant, idAccount, text)
        }
    }

    @DeleteMapping("/delete/{id-projeto}")
    fun deletarProjeto(
        @PathVariable("id-projeto") id: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            // projectEventRelationshipRepository.deleteByIdProject(id)
            service.deletarProjeto(id)
        }
    }
}