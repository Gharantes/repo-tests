package br.com.synergia.entityProject

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
}