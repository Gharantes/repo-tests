package br.com.synergia.pageExtendedEvent.services

import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.models.TagDto
import br.com.synergia.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageExtendedEventSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listProjectsOfEvent(idEvent: Long): List<ProjectDto> {
        val sql = SqlPath.PageExtendedEvent.LIST_PROJECTS_OF_EVENT.load()
        val paramMap = MapSqlParameterSource().addValue("id_event", idEvent, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.projectRowMapper)
    }
    fun listTagsOfEvent(idEvent: Long): List<TagDto> {
        val sql = SqlPath.PageExtendedEvent.LIST_TAGS_OF_EVENT.load()
        val paramMap = MapSqlParameterSource().addValue("id_event", idEvent, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.tagRowMapper)
    }
}