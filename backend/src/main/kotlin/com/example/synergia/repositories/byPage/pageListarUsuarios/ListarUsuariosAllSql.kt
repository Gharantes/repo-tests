package com.example.synergia.repositories.byPage.pageListarUsuarios

import com.example.synergia.models.byPage.pageListarUsuarios.dto.input.FiltroListarUsuariosAllDto
import com.example.synergia.models.byPage.pageListarUsuarios.dto.output.ListarUsuariosBasicInfoDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class ListarUsuariosAllSql (
    override val params: FiltroListarUsuariosAllDto
) : ISqlGetterStatement<ListarUsuariosBasicInfoDto, FiltroListarUsuariosAllDto> {

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
        WHERE a.id_tenant = :id_tenant
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
    }
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