package br.com.synergia.pageLogin.services

import br.com.synergia.pageLogin.models.LoginInformationInputDto
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class CheckLoginInformationSql (
    override val params: LoginInformationInputDto
) : ISqlGetterStatement<LoginInformationResponseDto, LoginInformationInputDto> {
    override val sql: String = """

    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
            .addValue("login", params.login, Types.VARCHAR)
            .addValue("password", params.password, Types.VARCHAR)
            .addValue("check_last_seen", params.checkLastSeen, Types.BOOLEAN)
    }
    override val rowMapper = RowMapper<LoginInformationResponseDto> { rs, _ ->
        LoginInformationResponseDto(
            idAccount = rs.getLong("id"),
            login = rs.getString("login"),
            idTenant = rs.getLong("id_tenant"),
            tenantTitle = rs.getString("tenant_title"),
            idPerson = rs.getLong("id_person").takeUnless { rs.wasNull() },
            firstName = rs.getString("first_name"),
            lastName = rs.getString("last_name"),
        )
    }
}