package br.com.synergia.pageUpsertTenant.services

import br.com.synergia.pageUpsertTenant.models.CreateTenantDto
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types
import java.time.LocalDateTime

@Service
class PageUpsertTenantSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun createTenant(params: CreateTenantDto) {
        val sql = SqlPath.PageUpsertTenant.INSERT_TENANT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("identifier", params.identifier, Types.VARCHAR)
        template.update(sql, paramMap)
    }
    fun createAdminAccount(idTenant: Long) {
        val sql = SqlPath.PageUpsertTenant.INSERT_ADMIN_ACCOUNT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("login", "ADMIN", Types.VARCHAR)
            .addValue("password", "ADMIN", Types.VARCHAR)
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("created_at", LocalDateTime.now(), Types.TIMESTAMP)
            .addValue("updated_at", LocalDateTime.now(), Types.TIMESTAMP)
        template.update(sql, paramMap)
    }
}