package br.com.synergia.rest

import br.com.synergia.pageUpsertTenant.models.UpsertTenantDto
import br.com.synergia.pageUpsertTenant.services.PageUpsertTenantService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-upsert-tenant")
class PageUpsertTenantResource (
    private val service: PageUpsertTenantService
) {
    @PostMapping("store")
    fun createTenant(
        @RequestBody params: UpsertTenantDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
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