package br.com.synergia.entityProject.services

import br.com.synergia.entityProject.models.UpsertProjectDto
import br.com.synergia.utilsEntities.models.ProjectDto
import org.springframework.stereotype.Service

@Service
class EntityProjectService (
    private val sqlService: EntityProjectSqlService,
) {
    fun listProjectsByTenant(idTenant: Long, text: String?): List<ProjectDto> {
        return sqlService.listProjectsByTenant(idTenant, text)
    }
    fun listProjectsByAccount(idAccount: Long, text: String?): List<ProjectDto> {
        return sqlService.listProjectsByAccount(idAccount, text)
    }
    fun listProjectsByEvent(idEvent: Long, text: String?): List<ProjectDto> {
        return sqlService.listProjectsByEvent(idEvent, text)
    }
    fun createProject(params: UpsertProjectDto) {
        val idProject = sqlService.createProject(params)
        sqlService.createProjectAccountRelationship(params.idAccount, idProject)
    }
    fun updateProject(idProject: Long, params: UpsertProjectDto) {
        return sqlService.updateProject(idProject, params)
    }
}