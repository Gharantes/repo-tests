package com.example.synergia.repositories.pageListarEventos

import com.example.synergia.rest.pageListarEventos.dto.input.FiltroListarEventosAllDto
import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosBasicInfoDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class ListarEventosAllSql (
    override val params: FiltroListarEventosAllDto
) : ISqlGetterStatement<ListarEventosBasicInfoDto, FiltroListarEventosAllDto> {
    override val sql: String = """
        SELECT 
            e.id,
            e.title,
            e.description
        FROM event e
        wHERE e.id_tenant = :id_tenant;
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
    }
    override val rowMapper = RowMapper<ListarEventosBasicInfoDto> { rs, _ ->
        ListarEventosBasicInfoDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            description = rs.getString("description")
        )
    }
}