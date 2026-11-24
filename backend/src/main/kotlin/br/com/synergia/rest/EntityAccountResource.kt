package br.com.synergia.rest

import br.com.synergia.config.autenticacao.usuarioLogado
import br.com.synergia.libs.entityAccount.models.UpsertAccountDto
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import br.com.synergia.libs.entityAccount.services.EntityAccountService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.AccountDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/entity-account")
class EntityAccountResource (
    private val entityAccountService: EntityAccountService
) {
    @PostMapping("/list-accounts-by-tenant")
    fun listAccountsByTenant(
        @RequestParam("id-tenant") idTenant: Long,
        @RequestParam("text", required = false) text: String? = null,
        @RequestParam("tag-ids", required = false) tagIds: List<Long>? = null,
        @RequestParam("lookup-tags", required = false) lookupTags: Boolean? = null,
        request: HttpServletRequest,
    ): ResponseEntity<List<AccountDto>> {
        // Só lista as contas da própria instituição: trocar o id-tenant não abre a de outra.
        if (idTenant != usuarioLogado(request).idTenant) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .header("x-error", "Sem acesso às contas desta instituição.")
                .build()
        }
        return ResponseMessenger.buildResponse {
            entityAccountService.listAccountsByTenant(idTenant, text, tagIds, lookupTags)
        }
    }
    @PostMapping("/list-accounts-by-event")
    fun listAccountsByEvent(
        @RequestParam("id-event") idEvent: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<AccountDto>> {
        return ResponseMessenger.buildResponse {
            entityAccountService.listAccountsByEvent(idEvent, text)
        }
    }
    @PostMapping("store")
    fun createAccount(
        @RequestBody params: UpsertAccountDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            entityAccountService.createAccount(params)
        }
    }
    @PostMapping("update/{id-account}")
    fun updateAccount(
        @PathVariable("id-account") idAccount: Long,
        @RequestBody params: UpsertAccountDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            entityAccountService.updateAccount(idAccount, params)
        }
    }
}