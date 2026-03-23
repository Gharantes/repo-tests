package br.com.synergia.rest

import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.utilsEntities.jpa.account.toDto
import br.com.synergia.utilsEntities.jpa.event.EventRepository
import br.com.synergia.utilsEntities.jpa.event.toDto
import br.com.synergia.utilsEntities.jpa.project.ProjectRepository
import br.com.synergia.utilsEntities.jpa.project.toDto
import br.com.synergia.utilsEntities.jpa.tag.TagRepository
import br.com.synergia.utilsEntities.jpa.tenant.TenantRepository
import br.com.synergia.utilsEntities.jpa.tenant.toDto
import br.com.synergia.utilsEntities.models.AccountDto
import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.ProjectDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/entity-delete-by-id")
class EntityDeleteByIdResource (
    private val tagRepository: TagRepository,
) {
    @GetMapping("delete-tag-by-id/{id-tag}")
    fun deleteTagById(
        @PathVariable("id-tag") idTag: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            tagRepository.deleteById(idTag)
        }
    }
}