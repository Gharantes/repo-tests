package br.com.synergia.rest

import br.com.synergia.entityTenant.models.UpsertTenantDto
import br.com.synergia.entityTenant.services.EntityTenantService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.TenantDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-tenant")
class EntityTenantResource (
    private val service: EntityTenantService
) {
    @PostMapping("/list-all-tenants")
    fun listAllTenants(
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<TenantDto>> {
        return ResponseMessenger.buildResponse {
            service.listAllTenants(text)
        }
    }
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