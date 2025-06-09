package com.example.synergia.services

import com.example.synergia.repositories.pageListarProjetos.DeletarProjetoSql
import com.example.synergia.repositories.pageListarProjetos.ListarProjetosAllSql
import com.example.synergia.rest.pageListarProjetos.dto.input.FiltroListarProjetosAllDto
import com.example.synergia.rest.pageListarProjetos.dto.output.ListarProjetosAllDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarProjetosService (
    private val template: JdbcTemplate
) {
    fun listarProjetosAll(
        params: FiltroListarProjetosAllDto
    ): List<ListarProjetosAllDto> =
        ListarProjetosAllSql(params).query(template)

    fun deletarProjeto(id: Long) = DeletarProjetoSql(id).executeStatement(template)
}