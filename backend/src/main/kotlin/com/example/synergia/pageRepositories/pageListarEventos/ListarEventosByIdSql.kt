package com.example.synergia.pageRepositories.pageListarEventos

import com.example.synergia.rest.pageListarEventos.dto.input.FiltroListarEventosByIdDto
import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosDto
import com.example.synergia.utils.interfaces.ISqlGetterStatement
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class ListarEventosByIdSql (
    override val params: FiltroListarEventosByIdDto
) : ISqlGetterStatement<ListarEventosDto, FiltroListarEventosByIdDto> {
    override val sql: String = """
        with is_member as (
            SELECT id_event FROM event_members em
            WHERE 
                em.id_event = :id_event AND 
                em.id_account = :id_ccount
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
                WHEN e.created_by = :id_ccount THEN true
                WHEN im.id_event IS NOT NULL THEN true
                ELSE FALSE END AS user_is_member
        FROM event e
        INNER JOIN account a ON 
            e.created_by = a.id
        LEFT JOIN attachments at ON
            e.id_banner = at.id AND
            at.attachment_type = 0
        LEFT JOIN is_member im ON im.id_event = e.id
        wHERE e.id = :id_event;
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_event", params.idEvent, Types.BIGINT)
        paramMap.addValue("id_ccount", params.idAccount, Types.BIGINT)
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