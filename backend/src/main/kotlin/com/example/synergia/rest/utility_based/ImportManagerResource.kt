package com.example.synergia.rest.utility_based

import com.example.synergia.services.utility_based.import.ImportAccountsService
import com.example.synergia.utils.objects.MediaTypes
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/import")
class ImportManagerResource (
    private val importAccountsService: ImportAccountsService
) {
    @PostMapping(
        "create-accounts-in-mass-from-excel-file",
        consumes = [MediaTypes.FILE]
    ) fun createAccountsInMassFromExcelFile(
        @RequestParam("id_tenant") idTenant: Long,
        @RequestPart("file") file: MultipartFile,
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            importAccountsService.createAccountsFromFile(file, false)
            null
        }
    }
}