package br.com.synergia.pageExtendedProjeto.services

import br.com.synergia.pageExtendedProjeto.models.ProjectDetailsDto
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageExtendedProjetoService (
    private val template: NamedParameterJdbcTemplate
) {
    fun getExtendedProjetoDetailsById(id: Long): ProjectDetailsDto {
        val sql = SqlPath.PageExtendedProjeto.GET_EXTENDED_PROJETO_DETAILS_BY_ID.load()
        val paramMap = MapSqlParameterSource().addValue("id", id, Types.BIGINT)
        return template.query(sql, paramMap) { rs, _ ->
            ProjectDetailsDto(
                id = rs.getLong("id"),
                title = rs.getString("title"),
                description = rs.getString("description"),
                urlBanner = rs.getString("url")
            )
        }.first()
    }
}