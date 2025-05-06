package com.example.synergia.repositories.pageListarEventos

import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosBasicInfoDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource

class ListarEventosAllSql (
    override val params: Unit
) : ISqlGetterStatement<ListarEventosBasicInfoDto, Unit> {
    override val sql: String = """
        SELECT 
            e.id,
            e.title,
            e.description
        FROM event e
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {}
    override val rowMapper = RowMapper<ListarEventosBasicInfoDto> { rs, _ ->
        ListarEventosBasicInfoDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            description = rs.getString("description")
        )
    }
}