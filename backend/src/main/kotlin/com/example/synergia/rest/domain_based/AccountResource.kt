package com.example.synergia.rest.domain_based

import com.example.synergia.dto.entity_mirror.AccountDto
import com.example.synergia.services.AccountService
import com.example.synergia.utils.objects.MediaTypes
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/account")
class AccountResource (
    private val accountService: AccountService,
) {
    @GetMapping(
        "get-by-id/{id_tenant}/{id}",
        produces = [MediaTypes.JSON]
    ) fun getAccountById(
        @PathVariable("id_tenant") idTenant: Long,
        @PathVariable("id") id: Long,
    ): ResponseEntity<AccountDto?> {
        return ResponseMessenger.buildResponse(null) {
            accountService.getById(idTenant, id);
        }
    }
    @GetMapping(
        "get-all/{id_tenant}",
        produces = [MediaTypes.JSON]
    ) fun getAllAccounts(
        @PathVariable("id_tenant") idTenant: Long
    ): ResponseEntity<List<AccountDto>> {
        return ResponseMessenger.buildResponse(null) {
            accountService.getAll(idTenant);
        }
    }



}
