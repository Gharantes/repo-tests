package br.com.synergia.entityTag.services

import br.com.synergia.entityTag.models.UpsertTagDto
import br.com.synergia.utilsCommons.extensions.parseStringToWildCard
import br.com.synergia.utilsEntities.jpa.tag.Tag
import br.com.synergia.utilsEntities.jpa.tag.TagRepository
import br.com.synergia.utilsEntities.models.TagDto
import br.com.synergia.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class EntityTagSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val tagRepository: TagRepository
) {
    fun listTags(idTenant: Long, text: String?): List<TagDto> {
        val sql = SqlPath.PageListTags.LIST_TAGS.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.tagRowMapper)
    }
    fun listTagsByEvent(idEvent: Long, text: String?): List<TagDto> {
        val sql = SqlPath.PageExtendedEvent.LIST_TAGS_OF_EVENT.load()
        val paramMap = MapSqlParameterSource().addValue("id_event", idEvent, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.tagRowMapper)
    }
    fun listTagsByProject(idProject: Long, text: String?): List<TagDto> {
        return emptyList()
    }
    fun createTag(params: UpsertTagDto) {
        val tag = Tag(
            idTenant = params.idTenant,
            title = params.title,
            forEvents = params.forEvents,
            forAccounts = params.forAccounts,
            forProjects = params.forProjects
        )
        tagRepository.save(tag)
    }
    fun updateTag(idTag: Long, params: UpsertTagDto) {
        tagRepository.findById(idTag).ifPresent { tag ->
            tag.title = params.title
            tag.forAccounts = params.forAccounts
            tag.forEvents = params.forEvents
            tag.forProjects = params.forProjects
            tagRepository.save(tag)
        }
    }
}