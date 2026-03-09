package br.com.synergia.pageUpsertTenant.services

import br.com.synergia.pageUpsertTenant.models.UpsertTenantDto
import br.com.synergia.utilsEntities.models.TenantDto
import org.springframework.stereotype.Service
import java.util.*

@Service
class PageUpsertTenantService (
    private val sqlService: PageUpsertTenantSqlService
) {
    fun getTenantByIdentifier(identifier: String): TenantDto? {
        return sqlService.getTenantByIdentifier(identifier)
    }
    fun createTenant(params: UpsertTenantDto): String {
        if (getTenantByIdentifier(params.identifier) != null) {
            throw Exception("Já existe um tenant com esse mesmo identifier: ${params.identifier}")
        }
        sqlService.createTenant(params)
        val idTenant = getTenantByIdentifier(params.identifier)?.id ?: throw Exception("Erro ao criar Tenant.")
        val password = UUID.randomUUID().toString()
        sqlService.createAdminAccount(idTenant, password)
        return password
    }
    fun updateTenant(idTenant: Long, params: UpsertTenantDto) {
        sqlService.updateTenant(idTenant, params)
    }
}