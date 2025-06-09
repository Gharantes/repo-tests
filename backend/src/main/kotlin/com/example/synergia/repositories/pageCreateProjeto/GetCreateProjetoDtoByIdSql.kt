package com.example.synergia.repositories.pageCreateProjeto

import com.example.synergia.rest.pageCreateProjeto.dto.input.CreateProjetoDto
import com.example.synergia.rest.pageCreateTenant.dto.input.CreateTenantDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class GetCreateProjetoDtoByIdSql (
    override val params: Long
) : ISqlGetterStatement<CreateProjetoDto, Long> {
    override val sql: String = """
        SELECT 
            p.id_tenant,
            p.title,
            p.description,
            p.created_by,
            a.url as url_banner
        FROM project p 
        LEFT JOIN attachments a ON a.id = p.id_banner
        WHERE id = :id
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id", params, Types.BIGINT)
    }

    override val rowMapper = RowMapper<CreateProjetoDto> { rs, _ ->
        CreateProjetoDto(
            idTenant = rs.getLong("id_tenant"),
            title = rs.getString("title"),
            description = rs.getString("description"),
            idAccount = rs.getLong("created_by"),
            urlBanner = rs.getString("url_banner")
        )
    }
}