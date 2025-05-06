package com.example.synergia.repositories.pageLogin

import com.example.synergia.rest.pageLogin.dto.input.LoginInformationInputDto
import com.example.synergia.rest.pageLogin.dto.output.LoginInformationResponseDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class CheckLoginInformationSql (
    override val params: LoginInformationInputDto
) : ISqlGetterStatement<LoginInformationResponseDto, LoginInformationInputDto> {
    override val sql: String = """
        SELECT 
            a.id,
            a.login,
            p.first_name,
            p.last_name,
            p.id as id_person
        FROM account a
        LEFT JOIN person p ON 
            a.id_tenant = p.id_tenant AND
            a.id = p.id_account
        WHERE 
            a.id_tenant = :id_tenant AND
            a.login = :login AND
            a.password = :password
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
            .addValue("login", params.login, Types.VARCHAR)
            .addValue("password", params.password, Types.VARCHAR)
    }
    override val rowMapper = RowMapper<LoginInformationResponseDto> { rs, _ ->
        LoginInformationResponseDto(
            idAccount = rs.getLong("id"),
            login = rs.getString("login"),
            idPerson = rs.getLong("id_person").takeUnless { rs.wasNull() },
            firstName = rs.getString("first_name"),
            lastName = rs.getString("last_name"),
        )
    }
}