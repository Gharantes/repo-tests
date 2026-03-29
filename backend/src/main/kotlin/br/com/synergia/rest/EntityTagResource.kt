package br.com.synergia.rest

import br.com.synergia.entityTag.models.UpsertTagDto
import br.com.synergia.entityTag.services.EntityTagService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/entity-tag")
class EntityTagResource (
    private val service: EntityTagService
) {
    @PostMapping("/list-tags-by-tenant")
    fun listTagsByTenant(
        @RequestParam("id-tenant") idTenant: Long,
        @RequestParam("text", required = false) text: String?
    ): ResponseEntity<List<TagDto>> {
        return ResponseMessenger.buildResponse { service.listTagsByTenant(idTenant, text) }
    }
    @PostMapping("/list-tags-by-event")
    fun listTagsByEvent(
        @RequestParam("id-event") idEvent: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<TagDto>> {
        return ResponseMessenger.buildResponse {
            service.listTagsByEvent(idEvent, text)
        }
    }
    @GetMapping("/list-tags-by-project")
    fun listTagsByProject(
        @RequestParam("id-project") idProject: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<TagDto>> {
        return ResponseMessenger.buildResponse {
            service.listTagsByProject(idProject, text)
        }
    }
    @PostMapping("/create-tag")
    fun createTag(
        @RequestBody params: UpsertTagDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.createTag(params)
        }
    }
    @PostMapping("/update-tag/{id-tag}")
    fun updateTag(
        @PathVariable("id-tag") idTag: Long,
        @RequestBody params: UpsertTagDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updateTag(idTag, params)
        }
    }
}