package com.example.synergia.services.byPage

import com.example.synergia.repositories.byDomain.ProjectEventRelationshipRepository
import com.example.synergia.repositories.byDomain.ProjectRepository
import com.example.synergia.repositories.byPage.pageListarProjetos.ListarProjetosAllSql
import com.example.synergia.models.byPage.pageListarProjetos.dto.input.FiltroListarProjetosAllDto
import com.example.synergia.models.byPage.pageListarProjetos.dto.output.ListarProjetosAllDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarProjetosService (
    private val template: NamedParameterJdbcTemplate,
    private val projectEventRelationshipRepository: ProjectEventRelationshipRepository,
    private val projectRepository: ProjectRepository
) {
    fun listarProjetosAll(
        params: FiltroListarProjetosAllDto
    ): List<ListarProjetosAllDto> =
        ListarProjetosAllSql(params).query(template)

    fun deletarProjeto(id: Long) {
        projectEventRelationshipRepository.deleteByIdProject(id)
        projectRepository.deleteById(id)
    }
}