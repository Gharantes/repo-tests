package br.com.synergia.rest

import br.com.synergia.entityAccount.models.UpsertAccountDto
import br.com.synergia.entityAccount.services.EntityAccountService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.AccountDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/entity-account")
class EntityAccountResource (
    private val entityAccountService: EntityAccountService
) {
    @PostMapping("/list-accounts-by-tenant")
    fun listAccountsByTenant(
        @RequestParam("id-tenant") idTenant: Long,
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<AccountDto>> {
        return ResponseMessenger.buildResponse {
            entityAccountService.listAccountsByTenant(idTenant, text)
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
    @GetMapping("get-account-by-login-or-email")
    fun getAccountByLoginOrEmail(
        @RequestParam("id-tenant") idTenant: Long,
        @RequestParam("id-account", required = false) idAccount: Long?,
        @RequestParam("login", required = false) login: String? = null,
        @RequestParam("email", required = false) email: String? = null
    ): ResponseEntity<Boolean> {
        return ResponseMessenger.buildResponse {
            entityAccountService.getAccountByLoginOrEmail(idTenant, idAccount, login, email)
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