package br.com.synergia.rest

import br.com.synergia.entityTag.services.EntityTagService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.utilsEntities.jpa.account.toDto
import br.com.synergia.utilsEntities.jpa.event.EventRepository
import br.com.synergia.utilsEntities.jpa.event.toDto
import br.com.synergia.utilsEntities.jpa.project.ProjectRepository
import br.com.synergia.utilsEntities.jpa.project.toDto
import br.com.synergia.utilsEntities.jpa.tag.TagRepository
import br.com.synergia.utilsEntities.jpa.tag.toDto
import br.com.synergia.utilsEntities.jpa.tenant.TenantRepository
import br.com.synergia.utilsEntities.jpa.tenant.toDto
import br.com.synergia.utilsEntities.models.AccountDto
import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/entity-get-by-id")
class EntityGetByIdResource (
    private val accountRepository: AccountRepository,
    private val tagRepository: TagRepository,
    private val eventRepository: EventRepository,
    private val projectRepository: ProjectRepository,
    private val entityTagService: EntityTagService
) {
    @GetMapping("get-account-by-id/{id-account}")
    fun getAccountById(
        @PathVariable("id-account") idAccount: Long
    ): ResponseEntity<AccountDto?> {
        return ResponseMessenger.buildResponse {
            accountRepository.findById(idAccount).orElse(null)?.toDto()
        }
    }
    @GetMapping("get-event-by-id/{id-event}")
    fun getEventById(
        @PathVariable("id-event") idEvent: Long,
        @RequestParam("lookup-tags", required = false) lookupTags: Boolean?
    ): ResponseEntity<EventDto?> {
        return ResponseMessenger.buildResponse {
            val el = eventRepository.findById(idEvent).orElse(null)?.toDto()
            if (lookupTags == true) {
                el?.tags = entityTagService.listTagsByEvent(idEvent, null)
            }
            el
        }
    }
    @GetMapping("get-project-by-id/{id-project}")
    fun getProjectById(
        @PathVariable("id-project") idProject: Long
    ): ResponseEntity<ProjectDto?> {
        return ResponseMessenger.buildResponse {
            projectRepository.findById(idProject).orElse(null)?.toDto()
        }
    }
    @GetMapping("get-tag-by-id/{id-tag}")
    fun getTagById(
        @PathVariable("id-tag") idTag: Long
    ): ResponseEntity<TagDto?> {
        return ResponseMessenger.buildResponse {
            tagRepository.findById(idTag).orElse(null)?.toDto()
        }
    }
}