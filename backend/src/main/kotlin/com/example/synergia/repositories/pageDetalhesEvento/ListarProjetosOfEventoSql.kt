package com.example.synergia.repositories.pageDetalhesEvento

import com.example.synergia.rest.pageDetalhesEvento.dto.input.FiltroListarProjetosOfEventoDto
import com.example.synergia.rest.pageDetalhesEvento.dto.output.ListarProjetosOfEventoDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class ListarProjetosOfEventoSql (
    override val params: FiltroListarProjetosOfEventoDto
) : ISqlGetterStatement<ListarProjetosOfEventoDto, FiltroListarProjetosOfEventoDto> {
    override val sql: String = """
        SELECT
            p.id,
            p.title,
            p.description
        FROM event e 
        INNER JOIN project_event_relationship per ON
            e.id_tenant = per.id_tenant AND 
            e.id = per.id_event
        INNER JOIN project p ON 
            per.id_tenant = p.id_tenant AND
            per.id_project = p.id
        WHERE 
            e.id_tenant = :id_tenant AND
            e.id = :id_event
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
        paramMap.addValue("id_event", params.idEvent, Types.BIGINT)
    }
    override val rowMapper = RowMapper<ListarProjetosOfEventoDto> { rs, _ ->
        ListarProjetosOfEventoDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            description = rs.getString("description")
        )
    }
}