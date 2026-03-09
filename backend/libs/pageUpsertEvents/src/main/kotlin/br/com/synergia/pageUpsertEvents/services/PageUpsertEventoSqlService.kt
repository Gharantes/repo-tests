package br.com.synergia.pageUpsertEvents.services

import br.com.synergia.pageUpsertEvents.models.UpsertEventDto
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageUpsertEventoSqlService (
    private val template: NamedParameterJdbcTemplate,
) {
    fun createEvent(params: UpsertEventDto) {
        val sql = SqlPath.PageUpsertEvento.INSERT_EVENT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("description", params.description, Types.VARCHAR)
            .addValue("id_account_owner", params.idAccount, Types.BIGINT)
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
        template.update(sql, paramMap)
    }

    fun updateEvent(idEvent: Long, params: UpsertEventDto) {
        val sql = SqlPath.PageUpsertEvento.UPDATE_EVENT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_event", idEvent, Types.BIGINT)
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("description", params.description, Types.VARCHAR)
        template.update(sql, paramMap)
    }
}