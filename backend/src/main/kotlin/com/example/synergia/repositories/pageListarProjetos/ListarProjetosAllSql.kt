package com.example.synergia.repositories.pageListarProjetos

import com.example.synergia.rest.pageListarProjetos.dto.input.FiltroListarProjetosAllDto
import com.example.synergia.rest.pageListarProjetos.dto.output.ListarProjetosBasicInfoDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class ListarProjetosAllSql (
    override val params: FiltroListarProjetosAllDto
) : ISqlGetterStatement<ListarProjetosBasicInfoDto, FiltroListarProjetosAllDto> {
    override val sql: String = """
        SELECT 
            p.id,
            p.title,
            p.description
        FROM project p
        WHERE 
            p.id_tenant = :id_tenant
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
    }
    override val rowMapper = RowMapper<ListarProjetosBasicInfoDto> { rs, _ ->
        ListarProjetosBasicInfoDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            description = rs.getString("description")
        )
    }
}