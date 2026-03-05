package br.com.synergia.pageListEventos.services

import br.com.synergia.pageListEventos.models.FiltroListarEventosAllDto
import br.com.synergia.pageListEventos.models.FiltroListarEventosByIdDto
import br.com.synergia.pageListEventos.models.ListarEventosDto
import br.com.synergia.pageListEventos.rowmappers.ListarEventosRowMapper
import br.com.synergia.utilsCommons.extensions.parseStringToWildCard
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageListEventosSqlService (
    private val template: NamedParameterJdbcTemplate
//    private val eventRepository: EventRepository,
//    private val projectEventRelationshipRepository: ProjectEventRelationshipRepository,
) {
    fun listarEventosAll(
        params: FiltroListarEventosAllDto
    ): List<ListarEventosDto> {
        val sql = SqlPath.PageListEventos.LISTAR_EVENTOS.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
            .addValue("id_account", params.idAccount, Types.BIGINT)
            .addValue("text", params.text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, ListarEventosRowMapper())
    }

    fun deletarEvento(idEvento: Long) {
        val sql = SqlPath.PageListEventos.DELETE_EVENTO.load()
        val paramMap = MapSqlParameterSource().addValue("id_evento", idEvento, Types.BIGINT)
        template.update(sql, paramMap)
    }

    fun getEventoById(params: FiltroListarEventosByIdDto): ListarEventosDto? {
        val sql = SqlPath.PageListEventos.GET_EVENTO_BY_ID.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_event", params.idEvent, Types.BIGINT)
            .addValue("id_ccount", params.idAccount, Types.BIGINT)
        return template.query(sql, paramMap, ListarEventosRowMapper()).firstOrNull()
    }
}