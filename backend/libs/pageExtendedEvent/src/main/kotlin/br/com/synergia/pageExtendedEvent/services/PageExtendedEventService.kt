package br.com.synergia.pageExtendedEvent.services

import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.stereotype.Service

@Service
class PageExtendedEventService (
    private val sqlService: PageExtendedEventSqlService,
) {
    fun listProjectsOfEvent(idEvent: Long): List<ProjectDto> {
        return sqlService.listProjectsOfEvent(idEvent)
    }
    fun listTagsOfEvent(idEvent: Long): List<TagDto> {
        return sqlService.listTagsOfEvent(idEvent)
    }
}