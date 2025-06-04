package com.example.synergia.repositories.pageListarEventos

import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class ListarEventosByIdSql (
    override val params: Long
) : ISqlGetterStatement<ListarEventosDto, Long> {
    override val sql: String = """
        SELECT 
            e.id,
            e.title,
            e.description,
            e.created_by,
            a.login as created_by_name,
            at.url as url_banner
        FROM event e
        INNER JOIN account a ON 
            e.created_by = a.id
        LEFT JOIN attachments at ON
            e.id_banner = at.id AND
            at.attachment_type = 1 --IMAGE
        wHERE e.id = :id;
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id", params, Types.BIGINT)
    }

    override val rowMapper = RowMapper<ListarEventosDto> { rs, _ ->
        ListarEventosDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            description = rs.getString("description"),
            createdByIdAccount = rs.getLong("created_by"),
            createdByNameAccount = rs.getString("created_by_name"),
            bannerUrl = rs.getString("url_banner")
        )
    }
}