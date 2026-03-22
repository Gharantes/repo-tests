package br.com.synergia.rest

import br.com.synergia.pageExtendedProjeto.services.PageExtendedProjectService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-extended-project")
class PageExtendedProjectResource (
    private val service: PageExtendedProjectService
) {
    @PostMapping("/list-events-of-project/{id-project}")
    fun listEventsOfProject(
        @PathVariable("id-project") idProject: Long
    ): ResponseEntity<List<EventDto>> {
        return ResponseMessenger.buildResponse {
            service.listEventsOfProject(idProject)
        }
    }

    @GetMapping("/list-tags-of-project/{id-project}")
    fun listTagsOfProject(
        @PathVariable("id-project") idProject: Long
    ): ResponseEntity<List<TagDto>> {
        return ResponseMessenger.buildResponse {
            service.listTagsOfProject(idProject)
        }
    }
}