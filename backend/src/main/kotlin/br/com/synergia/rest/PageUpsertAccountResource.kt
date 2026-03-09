package br.com.synergia.rest

import br.com.synergia.pageUpsertUsuario.models.UpsertAccountDto
import br.com.synergia.pageUpsertUsuario.services.PageUpsertAccountService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-upsert-account")
class PageUpsertAccountResource (
    private val service: PageUpsertAccountService
) {
    @GetMapping("account-exists-with-same-login-or-email")
    fun accountExistsWithSameLoginOrEmail(
        @RequestParam("idTenant") idTenant: Long,
        @RequestParam("login") login: String,
        @RequestParam("email") email: String,
        @RequestParam("idAccount", required = false) idAccount: Long?
    ): ResponseEntity<Boolean> {
        return ResponseMessenger.buildResponse {
            service.accountExistsWithSameLoginOrEmail(idTenant, login, email, idAccount)
        }
    }
    @PostMapping("store")
    fun createAccount(
        @RequestBody params: UpsertAccountDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.createAccount(params)
        }
    }
    @PostMapping("update/{id-account}")
    fun updateAccount(
        @PathVariable("id-account") idAccount: Long,
        @RequestBody params: UpsertAccountDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updateAccount(idAccount, params)
        }
    }
}