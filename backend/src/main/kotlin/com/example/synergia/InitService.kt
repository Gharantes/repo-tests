package com.example.synergia

import com.example.synergia.rest.pageCreateTenant.dto.input.CreateTenantDto
import com.example.synergia.services.PageCreateTenantService
import org.springframework.stereotype.Service

@Service
class InitService (
    private val pageCreateTenantService: PageCreateTenantService,
) {
    fun initTestData() {
        pageCreateTenantService.createTenant(CreateTenantDto(title = "ADMIN", identifier = "ADMIN"))
    }
}