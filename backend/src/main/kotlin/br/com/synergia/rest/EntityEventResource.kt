package br.com.synergia.rest

import br.com.synergia.entityTenant.EntityTenantService
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
}