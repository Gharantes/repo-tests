package com.example.synergia

import com.example.synergia.rest.pageCreateProjeto.dto.input.CreateProjetoDto
import com.example.synergia.rest.pageCreateTenant.dto.input.CreateTenantDto
import com.example.synergia.services.PageCreateProjetoService
import com.example.synergia.services.PageCreateTenantService
import org.springframework.stereotype.Service

@Service
class InitService (
    private val pageCreateTenantService: PageCreateTenantService,
    private val pageCreateProjetoService: PageCreateProjetoService
) {
    fun initTestData() {
        pageCreateTenantService.createTenant(CreateTenantDto(title = "ADMIN", identifier = "ADMIN"))
        pageCreateProjetoService.createProjeto(CreateProjetoDto(
            idTenant = 1L,
            title = "ASDASD",
            urlBanner = null,
            idAccount = 1L,
            description = "Descriptionasda"
        ))
    }
}