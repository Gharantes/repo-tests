package br.com.synergia.pageUpsertTenant.services

import org.springframework.stereotype.Service

@Service
class PageUpsertTenantService (
    private val slqService: PageUpsertTenantSqlService
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