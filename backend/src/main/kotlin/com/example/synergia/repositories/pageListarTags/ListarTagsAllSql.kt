package com.example.synergia.repositories.pageListarTags

import com.example.synergia.rest.pageListarTags.dto.input.FiltroListarTagsAllDto
import com.example.synergia.rest.pageListarTags.dto.output.ListarTagDto
import com.example.synergia.utils.extensions.parseStringToWildCard
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class ListarTagsAllSql (
    override val params: FiltroListarTagsAllDto
) : ISqlGetterStatement<ListarTagDto, FiltroListarTagsAllDto> {
    override val sql: String = """
        SELECT * FROM tags 
        WHERE 
            id_tenant = :id_tenant AND 
            (:text IS NULL OR name ILIKE :text)
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
        paramMap.addValue("text", params.text.parseStringToWildCard(), Types.VARCHAR)
    }

    override val rowMapper = RowMapper<ListarTagDto> { rs, _ ->
        ListarTagDto(
            id = rs.getLong("id"),
            name = rs.getString("name"),
            createdAt = rs.getTimestamp("created_at").toLocalDateTime()
        )
    }
}