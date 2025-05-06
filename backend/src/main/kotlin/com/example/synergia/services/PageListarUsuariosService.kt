package com.example.synergia.services

import com.example.synergia.repositories.pageListarUsuarios.ListarUsuariosAllSql
import com.example.synergia.rest.pageListarUsuarios.dto.output.ListarUsuariosBasicInfoDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarUsuariosService (
    private val template: JdbcTemplate
) {
    fun listarUsuariosAll(): List<ListarUsuariosBasicInfoDto> =
        ListarUsuariosAllSql().query(template)
}