package com.example.synergia.repositories.tenant

import com.example.synergia.dto.output.login_page.TenantLoginPageConfigInfoDto
import org.intellij.lang.annotations.Language
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class TenantJdbcRepository (
    private val jdbcTemplate: JdbcTemplate
) {
    fun getLoginPageConfigurationsOfTenantByTenantId(
        idTenant: Long
    ): TenantLoginPageConfigInfoDto? {
        @Language("PostgreSQL") val query = """
            SELECT 
                t.id,
                tc.login_bg_hex,
                tc.login_bg_url,
                tc.login_dark_mode
            FROM tenant t
            LEFT JOIN tenant_configuration tc on 
                t.id = tc.id_tenant
            WHERE t.id = :id;
        """.trimIndent()

        val template = NamedParameterJdbcTemplate(jdbcTemplate)
        val params = mapOf(
            "id" to idTenant
        )
        return try {
            template.queryForObject(query, params) { rs, _ ->
                TenantLoginPageConfigInfoDto(
                    id = rs.getLong("id"),
                    bgHex = rs.getString("login_bg_hex"),
                    bgUrl = rs.getString("login_bg_url"),
                    darkMode = rs.getBoolean("login_dark_mode")
                )
            }
        } catch (e: EmptyResultDataAccessException) {
            null
        }
    }
}