package com.example.synergia

import com.example.synergia.models.byPage.pageCreateProjeto.dto.input.CreateProjetoDto
import com.example.synergia.models.byPage.pageCreateTenant.dto.input.CreateTenantDto
import com.example.synergia.models.byPage.pageListarTags.dto.input.InsertTagDto
import com.example.synergia.repositories.statistics.AnonimizeViewsSql
import com.example.synergia.services.byPage.PageCreateProjetoService
import com.example.synergia.services.byPage.PageCreateTenantService
import com.example.synergia.services.byPage.PageListarTagsService
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class InitService (
    private val pageCreateTenantService: PageCreateTenantService,
    private val pageCreateProjetoService: PageCreateProjetoService,
    private val pageListarTagsService: PageListarTagsService,
    private val template: NamedParameterJdbcTemplate
) {
    fun anonimizePastData() {
        AnonimizeViewsSql().executeStatement(template)
    }
    fun initTestData() {
        pageCreateTenantService.createTenant(
            CreateTenantDto(
                title = "ADMIN",
                identifier = "ADMIN"
            )
        )
        pageCreateProjetoService.createProjeto(
            CreateProjetoDto(
                idTenant = 1L,
                title = "ASDASD",
                urlBanner = null,
                idAccount = 1L,
                description = "Descriptionasda"
            )
        )
        pageListarTagsService.insertTag(
            InsertTagDto(
                idTenant = 1L,
                name = "TESTE"
            )
        )
    }
}