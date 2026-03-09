package br.com.synergia.rest

import br.com.synergia.pageUpsertProjects.models.UpsertProjectDto
import br.com.synergia.pageUpsertProjects.services.PageUpsertProjectService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-upsert-project")
class PageUpsertProjectResource (
    private val service: PageUpsertProjectService
) {
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