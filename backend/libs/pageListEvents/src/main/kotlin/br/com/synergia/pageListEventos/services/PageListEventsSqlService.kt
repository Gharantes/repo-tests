package br.com.synergia.pageListEventos.services

import br.com.synergia.utilsCommons.extensions.parseStringToWildCard
import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageListEventsSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listEvents(
        idTenant: Long,
        text: String? = null
    ): List<EventDto> {
        val sql = SqlPath.PageListEvents.LIST_EVENTS.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.eventRowMapper)
    }
}