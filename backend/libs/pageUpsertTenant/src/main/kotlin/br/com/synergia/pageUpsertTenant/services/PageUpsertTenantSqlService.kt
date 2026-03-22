package br.com.synergia.pageUpsertTenant.services

import br.com.synergia.pageUpsertTenant.models.UpsertTenantDto
import br.com.synergia.utilsEntities.jpa.account.Account
import br.com.synergia.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.utilsEntities.jpa.tenant.Tenant
import br.com.synergia.utilsEntities.jpa.tenant.TenantRepository
import br.com.synergia.utilsEntities.jpa.tenant.toDto
import br.com.synergia.utilsEntities.models.TenantDto
import org.springframework.stereotype.Service

@Service
class PageUpsertTenantSqlService (
    private val tenantRepository: TenantRepository,
    private val accountRepository: AccountRepository
) {
    fun getTenantByIdentifier(identifier: String): TenantDto? {
        return tenantRepository.findByIdentifier(identifier).orElse(null)?.toDto()
    }
    fun createTenant(params: UpsertTenantDto) {
        val tenant = Tenant(
            identifier = params.identifier,
            title = params.title,
            isPrivate = params.isPrivate
        )
        tenantRepository.save(tenant)
    }
    fun createAdminAccount(idTenant: Long, password: String) {
        val account = Account(
            idTenant = idTenant,
            login = "ADMIN",
            password = password,
            firstName = "System",
            lastName = "Admin",
        )
        accountRepository.save(account)
    }
    fun updateTenant(idTenant: Long, params: UpsertTenantDto) {
        tenantRepository.findById(idTenant).ifPresent { tenant ->
            tenant.title = params.title
            tenant.identifier = params.identifier
            tenantRepository.save(tenant)
        }
    }
}