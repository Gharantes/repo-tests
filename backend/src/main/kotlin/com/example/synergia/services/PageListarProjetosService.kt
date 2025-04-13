package com.example.synergia.services

import com.example.synergia.repositories.pageListarProjetos.ListarProjetosAllSql
import com.example.synergia.rest.pageListarProjetos.dto.output.ListarProjetosBasicInfoDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarProjetosService (
    private val template: JdbcTemplate
) {
    fun listarProjetosAll(): List<ListarProjetosBasicInfoDto> =
        ListarProjetosAllSql(Unit).query(template)
}