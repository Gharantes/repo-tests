package com.example.synergia.services

import com.example.synergia.repositories.pageCreateTenant.CreateAdminAccountSql
import com.example.synergia.repositories.pageCreateTenant.CreateTenantSql
import com.example.synergia.repositories.pageCreateUsuario.CreateAccountSql
import com.example.synergia.rest.pageCreateTenant.dto.input.CreateTenantDto
import com.example.synergia.rest.pageCreateUsuario.dto.input.CreateUsuarioDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageCreateTenantService (
    private val template: JdbcTemplate
) {
    fun createTenant(params: CreateTenantDto) {
        val idTenant = CreateTenantSql(params).executeStatementWithReturnKey(template, "id")?.toLong()
        requireNotNull(idTenant) { "Erro ao criar Tenant." }
        CreateAdminAccountSql(idTenant).executeStatement(template)
    }
}