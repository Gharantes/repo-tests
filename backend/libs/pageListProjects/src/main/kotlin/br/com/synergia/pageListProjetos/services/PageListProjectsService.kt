package br.com.synergia.pageListProjetos.services

import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.services.EntityDeleteByIdService
import org.springframework.stereotype.Service

@Service
class PageListProjectsService (
    private val sqlService: PageListProjetosSqlService,
    private val deleteByIdService: EntityDeleteByIdService
) {
    fun listProjects(idTenant: Long, idAccount: Long, text: String?): List<ProjectDto> {
        return sqlService.listProjects(idTenant, idAccount, text)
    }
    fun deleteProject(idProject: Long) {
        deleteByIdService.deleteProjectEventRelationshipByIdProject(idProject)
        deleteByIdService.deleteProjectById(idProject)
    }

}