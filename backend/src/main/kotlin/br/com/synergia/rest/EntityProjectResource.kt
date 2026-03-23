package br.com.synergia.rest

import br.com.synergia.pageListAccounts.services.PageListAccountsService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.AccountDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-list-accounts")
class PageListAccountsResource (
    private val service: PageListAccountsService
) {
    @GetMapping("/list-accounts")
    fun listAccounts(
        @RequestParam("id-tenant") idTenant: Long,
        @RequestParam("text", required = false) text: String?
    ): ResponseEntity<List<AccountDto>> {
        return ResponseMessenger.buildResponse { service.listAccounts(idTenant, text) }
    }

    @DeleteMapping("/delete-account/{id-account}")
    fun deleteAccount(
        @PathVariable("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.deleteAccount(idAccount)
        }
    }
}