package com.example.synergia.repositories.byPage.pageDetalhesEvento

import com.example.synergia.utils.interfaces.ISqlGetterStatement
import com.example.synergia.utils.models.generics.GenericIdTextDto
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class GetTagsOfEventSql (
    override val params: Long
) : ISqlGetterStatement<GenericIdTextDto, Long> {
    override val sql: String = """
        SELECT 
            t.id,
            t.name
        FROM event_tag_relationship ptr
        INNER JOIN tags t ON ptr.id_tag = t.id
        WHERE ptr.id_event = :id_event
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_event", params, Types.BIGINT)
    }

    override val rowMapper = RowMapper<GenericIdTextDto> { rs, _ ->
        GenericIdTextDto(
            id=rs.getLong("id"),
            text = rs.getString("name")
        )
    }
}