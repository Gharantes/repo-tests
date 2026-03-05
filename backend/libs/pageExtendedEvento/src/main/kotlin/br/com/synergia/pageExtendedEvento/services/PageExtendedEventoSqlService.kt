package br.com.synergia.pageExtendedEvento.services

import br.com.synergia.pageExtendedEvento.models.ListarProjetosOfEventoDto
import br.com.synergia.utilsCommons.models.generic.GenericIdTextDto
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageExtendedEventoSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listarProjetosDoEvento(idEvento: Long): List<ListarProjetosOfEventoDto> {
        val sql = SqlPath.PageExtendedEvento.LISTAR_PROJETOS_DO_EVENTO.load()
        val paramMap = MapSqlParameterSource().addValue("id_event", idEvento, Types.BIGINT)
        return template.query(sql, paramMap) { rs, _ ->
            ListarProjetosOfEventoDto(
                id = rs.getLong("id"),
                title = rs.getString("title"),
                description = rs.getString("description")
            )
        }
    }
    fun listarTagsDoEvento(idEvento: Long): List<GenericIdTextDto> {
        val sql = SqlPath.PageExtendedEvento.LISTAR_TAGS_DO_EVENTO.load()
        val paramMap = MapSqlParameterSource().addValue("id_event", idEvento, Types.BIGINT)
        return template.query(sql, paramMap) { rs, _ ->
            GenericIdTextDto(
                id=rs.getLong("id"),
                text = rs.getString("name")
            )
        }
    }
}