package br.com.synergia.pageExtendedProjeto.services

import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.stereotype.Service

@Service
class PageExtendedProjectService (
    private val sqlService: PageExtendedProjectSqlService,
) {
    fun listEventsOfProject(idProject: Long): List<EventDto> {
        return sqlService.listEventsOfProject(idProject)
    }
    fun listTagsOfProject(idProject: Long): List<TagDto> {
        return sqlService.listTagsOfProject(idProject)
    }
}