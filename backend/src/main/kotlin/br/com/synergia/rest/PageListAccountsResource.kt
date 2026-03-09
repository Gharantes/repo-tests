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
    @PostMapping("/list-accounts")
    fun listAccounts(
        @PathVariable("id-tenant") idTenant: Long
    ): ResponseEntity<List<AccountDto>> {
        return ResponseMessenger.buildResponse { service.listAccounts(idTenant) }
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