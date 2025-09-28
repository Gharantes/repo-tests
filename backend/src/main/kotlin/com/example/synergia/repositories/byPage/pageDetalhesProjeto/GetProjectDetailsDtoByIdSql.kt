package com.example.synergia.repositories.byPage.pageDetalhesProjeto

import com.example.synergia.models.byPage.pageDetalhesProjeto.dto.output.ProjectDetailsDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class GetProjectDetailsDtoByIdSql (
    override val params: Long
) : ISqlGetterStatement<ProjectDetailsDto, Long> {
    override val sql: String = """
        SELECT
            p.id,
            p.title,
            p.description,
            a.url
        FROM project p 
        LEFT JOIN attachments a ON 
            p.id_tenant = a.id_tenant AND
            p.id_banner = a.id 
        WHERE p.id = :id 
    """.trimIndent()

    override val rowMapper = RowMapper<ProjectDetailsDto> { rs, _ ->
        ProjectDetailsDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            description = rs.getString("description"),
            urlBanner = rs.getString("url")
        )
    }

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id", params, Types.BIGINT)
    }
}