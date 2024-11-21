package com.example.synergia.rest

import com.example.synergia.dto.entity_mirror.AccountDto
import com.example.synergia.dto.entity_mirror.UsuarioDto
import com.example.synergia.services.AccountService
import com.example.synergia.utils.objects.MediaTypes
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/account")
class AccountResource (
    private val accountService: AccountService,
) {
    @GetMapping(
        "get-by-id/{id}",
        produces = [MediaTypes.JSON]
    ) fun getAccountById(
        @PathVariable("id") id: Long,
    ): ResponseEntity<UsuarioDto?> {
        return ResponseMessenger.buildResponse(null) {
            accountService.getById(id);
        }
    }
    @GetMapping(
        "get-all",
        produces = [MediaTypes.JSON]
    ) fun getAllAccounts(): ResponseEntity<List<UsuarioDto>> {
        return ResponseMessenger.buildResponse(null) {
            accountService.getAll();
        }
    }
    @PostMapping(
        "create-accounts-from-file",
        consumes = [MediaTypes.FILE]
    ) fun createAccountsFromFile(
        @RequestPart("file") file: MultipartFile,
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            accountService.createAccountsFromFile(file, false)
            null
        }
    }
    @GetMapping(
        "authenticate-account/{id_tenant}",
        produces = [MediaTypes.JSON]
    ) fun authenticateAccount(
        @PathVariable("id_tenant") idTenant: Long,
        @RequestParam("login") login: String,
        @RequestParam("password") password: String,
    ): ResponseEntity<AccountDto> {
        return ResponseMessenger.buildResponse(null) {
            accountService.authenticateAccount(
                idTenant,
                login,
                password
            )
        }
    }
    @PostMapping(
        "export-accounts-as-excel",
        produces = [MediaTypes.XLSX],
    ) fun exportAccountsAsExcel(): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            accountService.exportAccountsAsExcel()
            null
        }
    }
}
