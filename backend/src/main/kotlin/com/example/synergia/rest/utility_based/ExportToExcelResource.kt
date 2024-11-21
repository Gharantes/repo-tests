package com.example.synergia.rest.utility_based

import com.example.synergia.services.utility_based.export.ExportAccountsService
import com.example.synergia.utils.objects.MediaTypes
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/export_to_excel")
class ExportToExcelResource (
    private val exportAccountsService: ExportAccountsService
) {
    @PostMapping(
        "export-accounts-as-excel",
        produces = [MediaTypes.XLSX],
    ) fun exportAccountsAsExcel(): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            exportAccountsService.exportAccountsAsExcel()
            null
        }
    }
}