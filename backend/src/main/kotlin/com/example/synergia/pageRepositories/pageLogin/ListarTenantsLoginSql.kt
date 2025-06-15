package com.example.synergia.pageRepositories.pageLogin

import com.example.synergia.rest.pageLogin.dto.output.LoginTenantInformationDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource

class ListarTenantsLoginSql (
    override val params: Unit
) : ISqlGetterStatement<LoginTenantInformationDto, Unit> {
    override val sql: String = """
        SELECT 
            t.id,
            t.title,
            t.identifier
        FROM tenant t
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {}
    override val rowMapper = RowMapper<LoginTenantInformationDto> { rs, _ ->
        LoginTenantInformationDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            identifier = rs.getString("identifier")
        )
    }
}