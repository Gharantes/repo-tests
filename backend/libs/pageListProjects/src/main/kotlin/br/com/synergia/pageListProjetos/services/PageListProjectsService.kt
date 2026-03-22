package br.com.synergia.pageListProjetos.services

import br.com.synergia.utilsEntities.models.ProjectDto
import org.springframework.stereotype.Service

@Service
class PageListProjectsService (
    private val sqlService: PageListProjetosSqlService,
) {
    fun listProjects(idTenant: Long, text: String?): List<ProjectDto> {
        return sqlService.listProjects(idTenant, text)
    }
}