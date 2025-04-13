package com.example.synergia.services

import com.example.synergia.repositories.pageListarEventos.ListarEventosAllSql
import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosBasicInfoDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarEventosService (
    private val template: JdbcTemplate
) {
    fun listarEventosAll(): List<ListarEventosBasicInfoDto> =
        ListarEventosAllSql(Unit).query(template)
}