package com.example.synergia.repositories.pageListarEventos

import com.example.synergia.rest.pageListarEventos.dto.input.FiltroListarEventosAllDto
import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class ListarEventosAllSql (
    override val params: FiltroListarEventosAllDto
) : ISqlGetterStatement<ListarEventosDto, FiltroListarEventosAllDto> {
    override val sql: String = """
        with is_member as (
            SELECT id_event FROM event_members em
            WHERE em.id_account = :id_account
            LIMIT 1
        )
        SELECT 
            e.id,
            e.title,
            e.description,
            e.created_by,
            a.login as created_by_name,
            at.url as url_banner,
            CASE 
                WHEN e.created_by = :id_account THEN true
                WHEN im.id_event IS NOT NULL THEN true
                ELSE FALSE END AS user_is_member
        FROM event e
        INNER JOIN account a ON 
            e.created_by = a.id
        LEFT JOIN attachments at ON
            e.id_banner = at.id AND
            at.attachment_type = 1
        LEFT JOIN is_member im ON im.id_event = e.id
        wHERE e.id_tenant = :id_tenant;
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
        paramMap.addValue("id_account", params.idAccount, Types.BIGINT)
    }
    override val rowMapper = RowMapper<ListarEventosDto> { rs, _ ->
        ListarEventosDto(
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