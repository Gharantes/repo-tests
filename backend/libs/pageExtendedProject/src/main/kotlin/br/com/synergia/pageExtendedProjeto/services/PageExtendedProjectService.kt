package br.com.synergia.pageExtendedProjeto.services

import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.models.TagDto
import br.com.synergia.utilsEntities.services.EntityGetByIdService
import org.springframework.stereotype.Service

@Service
class PageExtendedProjectService (
    private val sqlService: PageExtendedProjectSqlService,
    private val entityGetByIdService: EntityGetByIdService
) {
    fun listEventsOfProject(idProject: Long): List<EventDto> {
        return sqlService.listEventsOfProject(idProject)
    }
    fun listTagsOfProject(idProject: Long): List<TagDto> {
        return sqlService.listTagsOfProject(idProject)
    }
    fun getExtendedProjectDetailsById(idProject: Long): ProjectDto? {
        val project = entityGetByIdService.getProjectById(idProject)
        if (project == null) return project

        project.tags = listTagsOfProject(idProject)
        project.events = listEventsOfProject(idProject)
        return project
    }
}