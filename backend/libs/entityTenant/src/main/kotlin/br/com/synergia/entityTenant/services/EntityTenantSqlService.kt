package br.com.synergia.entityTenant

import br.com.synergia.utilsEntities.jpa.tenant.TenantRepository
import br.com.synergia.utilsEntities.jpa.tenant.toDto
import br.com.synergia.utilsEntities.models.TenantDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class EntityTenantSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val tenantRepository: TenantRepository
) {
    fun listAllTenants(text: String?): List<TenantDto> {
        return tenantRepository.findAll().map { it.toDto() }
    }
}