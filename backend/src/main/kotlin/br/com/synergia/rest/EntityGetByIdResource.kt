package br.com.synergia.rest

import br.com.synergia.libs.entityAccount.services.EntityAccountService
import br.com.synergia.libs.entityTag.services.EntityTagService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.account.toDto
import br.com.synergia.libs.utilsEntities.jpa.event.EventRepository
import br.com.synergia.libs.utilsEntities.jpa.event.toDto
import br.com.synergia.libs.utilsEntities.jpa.project.ProjectRepository
import br.com.synergia.libs.utilsEntities.jpa.project.toDto
import br.com.synergia.libs.utilsEntities.jpa.tag.TagRepository
import br.com.synergia.libs.utilsEntities.jpa.tag.toDto
import br.com.synergia.libs.utilsEntities.models.AccountDto
import br.com.synergia.libs.utilsEntities.models.EventDto
import br.com.synergia.libs.utilsEntities.models.ProjectDto
import br.com.synergia.libs.utilsEntities.models.TagDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-get-by-id")
class EntityGetByIdResource (
    private val accountRepository: AccountRepository,
    private val tagRepository: TagRepository,
    private val eventRepository: EventRepository,
    private val projectRepository: ProjectRepository,
    private val entityTagService: EntityTagService,
    private val entityAccountService: EntityAccountService
) {
    @GetMapping("get-account-by-id/{id-account}")
    fun getAccountById(
        @PathVariable("id-account") idAccount: Long,
        @RequestParam("lookup-tags", required = false) lookupTags: Boolean? = false
    ): ResponseEntity<AccountDto?> {
        return ResponseMessenger.buildResponse {
            val el = accountRepository.findById(idAccount).orElse(null)?.toDto()
            if (lookupTags == true) {
                el?.tags = entityTagService.listTagsByAccount(idAccount, null)
            }
            el
        }
    }
    @GetMapping("get-event-by-id/{id-event}")
    fun getEventById(
        @PathVariable("id-event") idEvent: Long,
        @RequestParam("lookup-tags", required = false) lookupTags: Boolean? = false,
        @RequestParam("lookup-members", required = false) lookupMembers: Boolean? = false
    ): ResponseEntity<EventDto?> {
        return ResponseMessenger.buildResponse {
            val el = eventRepository.findById(idEvent).orElse(null)?.toDto()
            if (lookupTags == true) {
                el?.tags = entityTagService.listTagsByEvent(idEvent, null)
            }
            if (lookupMembers == true) {
                el?.members = entityAccountService.listAccountsByEvent(idEvent, text = null)
            }
            el
        }
    }
    @GetMapping("get-project-by-id/{id-project}")
    fun getProjectById(
        @PathVariable("id-project") idProject: Long,
        @RequestParam("lookup-tags", required = false) lookupTags: Boolean? = false,
        @RequestParam("lookup-members", required = false) lookupMembers: Boolean? = false,
    ): ResponseEntity<ProjectDto?> {
        return ResponseMessenger.buildResponse {
            val el = projectRepository.findById(idProject).orElse(null)?.toDto()
            if (lookupTags == true) {
                el?.tags = entityTagService.listTagsByProject(idProject, null)
            }
            if (lookupMembers == true) {
                el?.members = entityAccountService.listAccountsByProject(idProject, null)
            }
            el
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