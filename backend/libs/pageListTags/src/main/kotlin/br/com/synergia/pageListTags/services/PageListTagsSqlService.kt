package br.com.synergia.pageListTags.services

import br.com.synergia.utilsCommons.extensions.parseStringToWildCard
import br.com.synergia.utilsEntities.models.TagDto
import br.com.synergia.utilsEntities.rowmappers.TagRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageListTagsSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listTags(idTenant: Long, text: String?): List<TagDto> {
        val sql = SqlPath.PageListTags.LIST_TAGS.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, TagRowMapper())
    }
}