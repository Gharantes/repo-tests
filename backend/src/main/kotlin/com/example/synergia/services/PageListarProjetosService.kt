package com.example.synergia.services

import com.example.synergia.domainRepositories.ProjectEventRelationshipRepository
import com.example.synergia.domainRepositories.ProjectRepository
import com.example.synergia.pageRepositories.pageListarProjetos.ListarProjetosAllSql
import com.example.synergia.rest.pageListarProjetos.dto.input.FiltroListarProjetosAllDto
import com.example.synergia.rest.pageListarProjetos.dto.output.ListarProjetosAllDto
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