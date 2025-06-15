package com.example.synergia.services

import com.example.synergia.domain.AccountEntity
import com.example.synergia.domain.TenantEntity
import com.example.synergia.domainRepositories.AccountRepository
import com.example.synergia.domainRepositories.TenantRepository
import com.example.synergia.rest.pageCreateTenant.dto.input.CreateTenantDto
import jakarta.validation.ConstraintViolationException
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class PageCreateTenantService (
    private val template: NamedParameterJdbcTemplate,
    private val tenantRepository: TenantRepository,
    private val accountRepository: AccountRepository
) {
    fun createTenant(params: CreateTenantDto) {
        var tenantEntity = TenantEntity()
        tenantEntity.title = params.title
        tenantEntity.identifier = params.identifier
        tenantEntity = try {
            tenantRepository.save(tenantEntity)
        } catch (_: ConstraintViolationException) {
            throw Exception("O Identifier do tenant deve ser único.")
        }

        val accountEntity = AccountEntity()
        accountEntity.idTenant = tenantEntity.id
        accountEntity.createdAt = LocalDateTime.now()
        accountEntity.login = "ADMIN"
        accountEntity.password = "ADMIN"
        accountEntity.updatedAt = LocalDateTime.now()
        accountRepository.save(accountEntity)
    }
}