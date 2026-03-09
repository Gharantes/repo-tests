package br.com.synergia.rest

import br.com.synergia.pageListProjetos.services.PageListProjectsService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.ProjectDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-list-projects")
class PageListProjectsResource (
    private val service: PageListProjectsService
) {
    @PostMapping("/list-projects")
    fun listProjects(
        @RequestParam("idTenant") idTenant: Long,
        @RequestParam("idAccount") idAccount: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<ProjectDto>> {
        return ResponseMessenger.buildResponse {
            service.listProjects(idTenant, idAccount, text)
        }
    }

    @DeleteMapping("/delete/{id-project}")
    fun deleteProject(
        @PathVariable("id-project") id: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.deleteProject(id)
        }
    }
}