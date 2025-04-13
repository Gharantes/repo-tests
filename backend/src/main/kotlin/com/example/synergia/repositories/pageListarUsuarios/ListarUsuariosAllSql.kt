package com.example.synergia.repositories.pageListarUsuarios

import com.example.synergia.rest.pageListarUsuarios.dto.output.ListarUsuariosBasicInfoDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource

class ListarUsuariosAllSql : ISqlGetterStatement<ListarUsuariosBasicInfoDto, Unit> {
    override val params = Unit
    override val sql: String = """
        SELECT 
            a.id,
            a.login,
            p.id as id_person,
            p.first_name,
            p.last_name
        FROM account a
        LEFT JOIN person p ON 
            a.id_tenant = p.id_tenant AND
            a.id = p.id_account
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {}
    override val rowMapper = RowMapper<ListarUsuariosBasicInfoDto> { rs, _ ->
        ListarUsuariosBasicInfoDto(
            idAccount = rs.getLong("id"),
            idPerson = rs.getLong("id_person").takeUnless { rs.wasNull() },
            login = rs.getString("login"),
            firstName = rs.getString("first_name"),
            lastName = rs.getString("last_name")
        )
    }
}