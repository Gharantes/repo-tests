package br.com.synergia.pageUpsertProjects.services

import br.com.synergia.pageUpsertProjects.models.UpsertProjectDto
import org.springframework.stereotype.Service

@Service
class PageUpsertProjectService (
    private val sqlService: PageUpsertProjectSqlService,
) {
    fun createProject(params: UpsertProjectDto) {
        return sqlService.createProject(params)
    }
    fun updateProject(idProject: Long, params: UpsertProjectDto) {
        return sqlService.updateProject(idProject, params)
    }
}