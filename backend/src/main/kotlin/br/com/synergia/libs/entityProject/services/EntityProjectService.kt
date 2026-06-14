package br.com.synergia.libs.entityProject.services

import br.com.synergia.libs.entityProject.models.UpsertProjectDto
import br.com.synergia.libs.utilsEntities.models.ProjectDto
import org.springframework.stereotype.Service

@Service
class EntityProjectService (
    private val sqlService: EntityProjectSqlService,
) {
    fun listProjectsByTenant(idTenant: Long, text: String?, tagIds: List<Long>? = null): List<ProjectDto> {
        return sqlService.listProjectsByTenant(idTenant, text, tagIds)
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
        sqlService.createProjectTagRelationship(idProject, params.tags)
    }
    fun updateProject(idProject: Long, params: UpsertProjectDto) {
        sqlService.updateProject(idProject, params)
        sqlService.deleteProjectTagRelationshipByIdProject(idProject)
        sqlService.createProjectTagRelationship(idProject, params.tags)
    }
}