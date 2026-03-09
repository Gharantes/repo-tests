package br.com.synergia.pageExtendedEvent.services

import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.models.TagDto
import br.com.synergia.utilsEntities.services.EntityGetByIdService
import org.springframework.stereotype.Service

@Service
class PageExtendedEventService (
    private val sqlService: PageExtendedEventSqlService,
    private val entityGetByIdService: EntityGetByIdService
) {
    fun listProjectsOfEvent(idEvent: Long): List<ProjectDto> {
        return sqlService.listProjectsOfEvent(idEvent)
    }
    fun listTagsOfEvent(idEvent: Long): List<TagDto> {
        return sqlService.listTagsOfEvent(idEvent)
    }
    fun getDetailedEventById(idEvent: Long): EventDto? {
        val event = entityGetByIdService.getEventById(idEvent)
        if (event == null) return null
        event.tags = listTagsOfEvent(idEvent)
        event.projects = listProjectsOfEvent(idEvent)
        return event
    }
}