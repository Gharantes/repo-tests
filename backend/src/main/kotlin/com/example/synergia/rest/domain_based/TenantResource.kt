package com.example.synergia.rest.domain_based

import com.example.synergia.dto.entity_mirror.TenantDto
import com.example.synergia.dto.utilities.IdentifierDto
import com.example.synergia.services.TenantService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/tenant")
class TenantResource (
    private val tenantService: TenantService
) {
    @GetMapping("see-all-tenants-on-database")
    fun seeAllTenantsOnDatabase(): ResponseEntity<List<TenantDto>> {
        return ResponseMessenger.buildResponse(null) {
            tenantService.seeAllTenantsOnDatabase()
        }
    }
    @GetMapping("get-tenant-by-unique-keys")
    fun getTenantByUniqueKeys(
        @RequestParam("id_tenant", required = false) idTenant: Long?,
        @RequestParam("identifier", required = false) identifier: String?,
    ): ResponseEntity<IdentifierDto?> {
        return ResponseMessenger.buildResponse(null) {
            tenantService.getTenantByUniqueKeys(idTenant, identifier);
        }
    }

}
