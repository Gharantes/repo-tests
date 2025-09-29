package com.example.synergia.services.byPage

import com.example.synergia.repositories.byDomain.relationships.ProjectEventRelationshipRepository
import com.example.synergia.repositories.byDomain.ProjectRepository
import com.example.synergia.repositories.byPage.pageListarProjetos.ListarProjetosAllSql
import com.example.synergia.models.byPage.pageListarProjetos.dto.input.FiltroListarProjetosAllDto
import com.example.synergia.models.byPage.pageListarProjetos.dto.output.ListarProjetosAllDto
import com.example.synergia.services.statistics.StatisticsSearchService
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarProjetosService (
    private val template: NamedParameterJdbcTemplate,
    private val projectEventRelationshipRepository: ProjectEventRelationshipRepository,
    private val projectRepository: ProjectRepository,
    private val statisticsSearchService: StatisticsSearchService
) {
    fun listarProjetosAll(
        params: FiltroListarProjetosAllDto
    ): List<ListarProjetosAllDto> {
        statisticsSearchService.createFromFiltroListarProjetosAllDto(params)
        return ListarProjetosAllSql(params).query(template)
    }

    fun deletarProjeto(id: Long) {
        projectEventRelationshipRepository.deleteByIdProject(id)
        projectRepository.deleteById(id)
    }
}