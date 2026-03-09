package br.com.synergia.rest

import br.com.synergia.pageUpsertTenant.models.UpsertTenantDto
import br.com.synergia.pageUpsertTenant.services.PageUpsertTenantService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/page-upsert-tenant")
class PageUpsertTenantResource (
    private val service: PageUpsertTenantService
) {
    @PostMapping("store")
    fun createTenant(
        @RequestBody params: UpsertTenantDto
    ): ResponseEntity<String> {
        return ResponseMessenger.buildResponse {
            service.createTenant(params)
        }
    }
    @PostMapping("update/{id-tenant}")
    fun updateTenant(
        @PathVariable("id-tenant") idTenant: Long,
        @RequestBody params: UpsertTenantDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updateTenant(idTenant, params)
        }
    }
}