package br.com.synergia.pageUpsertTenant.services

import br.com.synergia.pageUpsertTenant.models.UpsertTenantDto
import br.com.synergia.utilsEntities.models.TenantDto
import br.com.synergia.utilsEntities.rowmappers.TenantRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageUpsertTenantSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun getTenantByIdentifier(identifier: String): TenantDto? {
        val sql = SqlPath.PageUpsertTenant.GET_TENANT_BY_IDENTIFIER.load()
        val paramMap = MapSqlParameterSource().addValue("identifier", identifier, Types.VARCHAR)
        return template.query(sql, paramMap, TenantRowMapper()).firstOrNull()
    }

    fun createTenant(params: UpsertTenantDto) {
        val sql = SqlPath.PageUpsertTenant.INSERT_TENANT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("identifier", params.identifier, Types.VARCHAR)
        template.update(sql, paramMap)
    }
    fun createAdminAccount(idTenant: Long, password: String) {
        val sql = SqlPath.PageUpsertTenant.INSERT_ADMIN_ACCOUNT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("password", password, Types.VARCHAR)
        template.update(sql, paramMap)
    }
    fun updateTenant(idTenant: Long, params: UpsertTenantDto) {
        val sql = SqlPath.PageUpsertTenant.UPDATE_TENANT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("identifier", params.identifier, Types.VARCHAR)
        template.update(sql, paramMap)
    }
}