package com.example.synergia.repositories.pageListarProjetos

import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosBasicInfoDto
import com.example.synergia.rest.pageListarProjetos.dto.output.ListarProjetosBasicInfoDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource

class ListarProjetosAllSql (
    override val params: Unit
) : ISqlGetterStatement<ListarProjetosBasicInfoDto, Unit> {
    override val sql: String = """
        SELECT 
            e.id,
            e.title,
            e.description
        FROM event e
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {}
    override val rowMapper = RowMapper<ListarProjetosBasicInfoDto> { rs, _ ->
        ListarProjetosBasicInfoDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            description = rs.getString("description")
        )
    }
}