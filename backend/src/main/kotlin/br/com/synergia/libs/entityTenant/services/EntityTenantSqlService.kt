package br.com.synergia.libs.entityTenant.services

import br.com.synergia.libs.entityTenant.models.UpsertTenantDto
import br.com.synergia.libs.utilsEntities.jpa.account.Account
import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.tenant.Tenant
import br.com.synergia.libs.utilsEntities.jpa.tenant.TenantRepository
import br.com.synergia.libs.utilsEntities.jpa.tenant.toDto
import br.com.synergia.libs.utilsEntities.models.TenantDto
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class EntityTenantSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val tenantRepository: TenantRepository,
    private val accountRepository: AccountRepository
) {
    fun listAllTenants(text: String?): List<TenantDto> {
        return tenantRepository.findAll().map { it.toDto() }
    }
    fun getTenantByIdentifier(identifier: String): TenantDto? {
        return tenantRepository.findByIdentifier(identifier).orElse(null)?.toDto()
    }
    fun createTenant(params: UpsertTenantDto) {
        val tenant = Tenant(
            identifier = params.identifier,
            title = params.title,
        )
        tenantRepository.save(tenant)
    }
    fun createAdminAccountForTenant(idTenant: Long, login: String, password: String) {
        val account = Account(
            idTenant = idTenant,
            login = login,
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
    /** Apaga o tenant e tudo que pertence a ele (contas, eventos, projetos, tags, posts e vínculos). */
    fun deleteTenant(idTenant: Long) {
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
        template.update(SqlPath.EntityTenant.DELETE_TENANT.load(), paramMap)
    }
}
