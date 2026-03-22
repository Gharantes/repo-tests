package br.com.synergia.pageUpsertProjects.services

import br.com.synergia.pageUpsertProjects.models.UpsertProjectDto
import br.com.synergia.utilsEntities.jpa.project.Project
import br.com.synergia.utilsEntities.jpa.project.ProjectRepository
import org.springframework.stereotype.Service

@Service
class PageUpsertProjectSqlService (
    private val projectRepository: ProjectRepository
) {
    fun createProject(params: UpsertProjectDto) {
        val project = Project(
            idTenant = params.idTenant,
            description = params.description,
            title = params.title,
            bannerUrl = params.bannerUrl
        )
        projectRepository.save(project)
    }

    fun updateProject(idProject: Long, params: UpsertProjectDto) {
        val project = projectRepository.findById(idProject).orElseThrow()
        project.title = params.title
        project.description = params.description
        project.bannerUrl = params.bannerUrl
        projectRepository.save(project)
    }
}