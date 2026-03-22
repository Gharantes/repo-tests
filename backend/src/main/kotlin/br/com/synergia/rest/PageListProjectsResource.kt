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
        @RequestParam("id-tenant") idTenant: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<ProjectDto>> {
        return ResponseMessenger.buildResponse {
            service.listProjects(idTenant, text)
        }
    }
}