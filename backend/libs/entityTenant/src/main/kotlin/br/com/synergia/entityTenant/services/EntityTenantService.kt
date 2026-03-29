package br.com.synergia.entityTenant.services

import br.com.synergia.entityTenant.models.UpsertTenantDto
import br.com.synergia.utilsEntities.models.TenantDto
import org.springframework.stereotype.Service

@Service
class EntityTenantService (
    private val sqlService: EntityTenantSqlService
) {
    fun listAllTenants(text: String?): List<TenantDto> {
        return sqlService.listAllTenants(text)
    }
    fun getTenantByIdentifier(identifier: String): TenantDto? {
        return sqlService.getTenantByIdentifier(identifier)
    }
    fun createTenant(params: UpsertTenantDto) {
        if (getTenantByIdentifier(params.identifier) != null) {
            throw Exception("Já existe um tenant com esse mesmo identifier: ${params.identifier}")
        }
        sqlService.createTenant(params)

        val idTenant = getTenantByIdentifier(params.identifier)?.id ?: throw Exception("Erro ao criar Tenant.")
        sqlService.createAdminAccountForTenant(idTenant, params.password)
    }
    fun updateTenant(idTenant: Long, params: UpsertTenantDto) {
        sqlService.updateTenant(idTenant, params)
    }
}