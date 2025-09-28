package com.example.synergia.pageRepositories.pageListarProjetos

import com.example.synergia.rest.pageListarProjetos.dto.input.FiltroListarProjetosAllDto
import com.example.synergia.rest.pageListarProjetos.dto.output.ListarProjetosAllDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class ListarProjetosAllSql (
    override val params: FiltroListarProjetosAllDto
) : ISqlGetterStatement<ListarProjetosAllDto, FiltroListarProjetosAllDto> {
    override val sql: String = """
        with is_member as (
            SELECT id_project FROM project_members pm
            WHERE pm.id_account = :id_account
            LIMIT 1
        )
        SELECT 
            p.id,
            p.title,
            p.description,
            p.created_by,
            a.login as created_by_name,
            at.url as url_banner,
            CASE 
                WHEN p.created_by = :id_account THEN true
                WHEN im.id_project IS NOT NULL THEN true
                ELSE FALSE END AS user_is_member
        FROM project p
        INNER JOIN account a ON p.created_by = a.id
        LEFT JOIN attachments at ON
            p.id_banner = at.id AND
            at.attachment_type = 0
        LEFT JOIN is_member im ON im.id_project = p.id
        WHERE 
            p.id_tenant = :id_tenant
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
        paramMap.addValue("id_account", params.idAccount, Types.BIGINT)
    }
    override val rowMapper = RowMapper<ListarProjetosAllDto> { rs, _ ->
        ListarProjetosAllDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            description = rs.getString("description"),
            createdByIdAccount = rs.getLong("created_by"),
            createdByNameAccount = rs.getString("created_by_name"),
            bannerUrl = rs.getString("url_banner"),
            userIsMember = rs.getBoolean("user_is_member")
        )
    }
}