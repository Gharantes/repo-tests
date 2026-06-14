package br.com.synergia.rest

import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.tag.TagRepository
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-delete-by-id")
class EntityDeleteByIdResource (
    private val tagRepository: TagRepository,
    private val accountRepository: AccountRepository
) {
    @GetMapping("delete-tag-by-id/{id-tag}")
    fun deleteTagById(
        @PathVariable("id-tag") idTag: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            tagRepository.deleteById(idTag)
        }
    }
    @DeleteMapping("/delete-account/{id-account}")
    fun deleteAccount(
        @PathVariable("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            accountRepository.deleteById(idAccount)
        }
    }
}