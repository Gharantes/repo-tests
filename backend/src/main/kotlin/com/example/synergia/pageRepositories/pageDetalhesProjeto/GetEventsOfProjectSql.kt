package com.example.synergia.pageRepositories.pageDetalhesProjeto

import com.example.synergia.utils.interfaces.ISqlGetterStatement
import com.example.synergia.utils.models.generics.GenericIdTextDto
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class GetEventsOfProjectSql (
    override val params: Long
) : ISqlGetterStatement<GenericIdTextDto, Long> {
    override val sql: String = """
        SELECT 
            e.id,
            e.title
        FROM project_event_relationship per
        INNER JOIN event e ON per.id_event = e.id
        WHERE per.id_project = :id_project
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_project", params, Types.BIGINT)
    }

    override val rowMapper = RowMapper<GenericIdTextDto> { rs, _ ->
        GenericIdTextDto(
            id=rs.getLong("id"),
            text = rs.getString("title")
        )
    }
}