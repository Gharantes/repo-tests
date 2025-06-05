package com.example.synergia.repositories.pageCreateEvento

import com.example.synergia.rest.pageCreateEvento.dto.input.CreateEventoDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class GetCreateEventoDtoByIdSql (
    override val params: Long
) : ISqlGetterStatement<CreateEventoDto, Long> {

    override val sql: String = """
        SELECT 
            e.id_tenant,
            e.title,
            e.description,
            e.created_by AS created_by,
            a.url AS url_banner
        FROM event e
        INNER JOIN attachments a ON a.id = e.id_banner
        WHERE e.id = :id
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id", params, Types.BIGINT)
    }

    override val rowMapper = RowMapper<CreateEventoDto> { rs, _ ->
        CreateEventoDto(
            idTenant=rs.getLong("id_tenant"),
            title=rs.getString("title"),
            description=rs.getString("description"),
            createdByIdAccount=rs.getLong("created_by"),
            urlBanner=rs.getString("url_banner"),
        )
    }
}