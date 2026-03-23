package br.com.synergia.entityTenant

import br.com.synergia.utilsEntities.models.TenantDto
import org.springframework.stereotype.Service

@Service
class EntityTenantService (
    private val sqlService: EntityTenantSqlService
) {
    fun listAllTenants(text: String?): List<TenantDto> {
        return sqlService.listAllTenants(text)
    }
}