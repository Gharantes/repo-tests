package com.example.synergia.services.location_specific

import com.example.synergia.dto.entity_mirror.AccountDto
import com.example.synergia.dto.output.login_page.TenantLoginPageConfigInfoDto
import com.example.synergia.mappers.AccountMapper
import com.example.synergia.repositories.AccountRepository
import com.example.synergia.repositories.tenant.TenantJdbcRepository
import org.springframework.stereotype.Service

@Service
class LoginPageService (
    private val accountRepository: AccountRepository,
    private val tenantJdbcRepository: TenantJdbcRepository
) {
    fun authenticateAccount(
        idTenant: Long,
        login: String,
        password: String
    ): AccountDto {
        val entity = accountRepository.findByIdTenantAndLoginAndPassword(
            idTenant,
            login,
            password
        )
        return entity ?.let { account ->
            AccountMapper().entityToAccountDto(account)
        } ?: run {
            throw RuntimeException("Account not found")
        }
    }

    fun getLoginPageConfigurationsOfTenantByTenantId(
        idTenant: Long
    ): TenantLoginPageConfigInfoDto? {
        return tenantJdbcRepository.getLoginPageConfigurationsOfTenantByTenantId(
            idTenant = idTenant
        )
    }
}