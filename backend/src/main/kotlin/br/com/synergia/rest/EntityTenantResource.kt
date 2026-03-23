package br.com.synergia.rest

import br.com.synergia.entityProject.EntityProjectService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.ProjectDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-project")
class EntityProjectResource (
    private val service: EntityProjectService
) {
    @PostMapping("/list-projects-by-tenant")
    fun listProjectsByTenant(
        @RequestParam("id-tenant") idTenant: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<ProjectDto>> {
        return ResponseMessenger.buildResponse {
            service.listProjectsByTenant(idTenant, text)
        }
    }
    @PostMapping("/list-projects-by-account")
    fun listProjectsByAccount(
        @RequestParam("id-account") idAccount: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<ProjectDto>> {
        return ResponseMessenger.buildResponse {
            service.listProjectsByAccount(idAccount, text)
        }
    }
}