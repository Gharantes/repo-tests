package com.example.synergia.rest.byPage

import com.example.synergia.models.byPage.pageCreateTenant.dto.input.CreateTenantDto
import com.example.synergia.services.byPage.PageCreateTenantService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/create-tenant")
class PageCreateTenantResource (
    private val service: PageCreateTenantService
) {
    @PostMapping("store")
    fun createTenant(
        @RequestBody params: CreateTenantDto
    ): ResponseEntity<Void> = ResponseMessenger.responseWithoutReturn {
        service.createTenant(params)
    }
}