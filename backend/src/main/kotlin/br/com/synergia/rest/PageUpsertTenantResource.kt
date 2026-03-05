package br.com.synergia.rest

import br.com.synergia.pageUpsertTenant.models.CreateTenantDto
import br.com.synergia.pageUpsertTenant.services.PageUpsertTenantService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
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
        @RequestBody params: CreateTenantDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.createTenant(params)
        }
    }
}