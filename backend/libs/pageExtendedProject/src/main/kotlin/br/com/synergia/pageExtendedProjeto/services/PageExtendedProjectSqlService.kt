package br.com.synergia.pageExtendedProjeto.services

import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageExtendedProjectSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listEventsOfProject(idProject: Long): List<EventDto> {
        return emptyList()
    }
    fun listTagsOfProject(idProject: Long): List<TagDto> {
        return emptyList()
    }
}