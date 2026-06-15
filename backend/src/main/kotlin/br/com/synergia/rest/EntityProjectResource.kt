package br.com.synergia.rest

import br.com.synergia.libs.entityProject.models.UpsertProjectDto
import br.com.synergia.libs.entityProject.services.EntityProjectService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.ProjectDto
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
        @RequestParam("text", required = false) text: String? = null,
        @RequestParam("tag-ids", required = false) tagIds: List<Long>? = null
    ): ResponseEntity<List<ProjectDto>> {
        return ResponseMessenger.buildResponse {
            service.listProjectsByTenant(idTenant, text, tagIds)
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
    @PostMapping("/list-projects-of-event")
    fun listProjectsByEvent(
        @RequestParam("id-event") idEvent: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<ProjectDto>> {
        return ResponseMessenger.buildResponse {
            service.listProjectsByEvent(idEvent, text)
        }
    }
    @PostMapping("store")
    fun createProject(
        @RequestBody params: UpsertProjectDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.createProject(params)
        }
    }
    @PostMapping("update/{id-project}")
    fun updateProject(
        @PathVariable("id-project") idProject: Long,
        @RequestBody params: UpsertProjectDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updateProject(idProject, params)
        }
    }
}