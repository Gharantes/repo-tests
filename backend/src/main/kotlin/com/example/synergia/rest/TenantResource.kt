package com.example.synergia.rest

import com.example.synergia.utils.objects.ResponseMessenger
import com.example.synergia.dto.entity_mirror.EventoDto
import com.example.synergia.dto.entity_mirror.ProjetoDto
import com.example.synergia.dto.input.CreateEventoDto
import com.example.synergia.dto.output.TenantLoginPageConfigInfoDto
import com.example.synergia.dto.utilities.IdentifierDto
import com.example.synergia.services.EventoService
import com.example.synergia.services.TenantService
import com.example.synergia.utils.objects.MediaTypes
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/tenant")
class TenantResource (
    private val tenantService: TenantService
) {
    @GetMapping("get-tenant-by-unique-keys")
    fun getTenantByUniqueKeys(
        @RequestParam("id_tenant", required = false) idTenant: Long?,
        @RequestParam("identifier", required = false) identifier: String?,
    ): ResponseEntity<IdentifierDto?> {
        return ResponseMessenger.buildResponse(null) {
            tenantService.getTenantByUniqueKeys(idTenant, identifier);
        }
    }

    @GetMapping("get-login-page-configurations-of-tenant/{id_tenant}")
    fun getLoginPageConfigurationsOfTenantByTenantId(
        @PathVariable("id_tenant") idTenant: Long,
    ): ResponseEntity<TenantLoginPageConfigInfoDto?> {
        return ResponseMessenger.buildResponse(null) {
            tenantService.getLoginPageConfigurationsOfTenantByTenantId(idTenant);
        }
    }
}
