package com.example.synergia.services

import com.example.synergia.repositories.pageListarProjetos.DeletarProjetoSql
import com.example.synergia.repositories.pageListarUsuarios.DeletarAccountSql
import com.example.synergia.repositories.pageListarUsuarios.ListarUsuariosAllSql
import com.example.synergia.rest.pageListarUsuarios.dto.input.FiltroListarUsuariosAllDto
import com.example.synergia.rest.pageListarUsuarios.dto.output.ListarUsuariosBasicInfoDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarUsuariosService (
    private val template: JdbcTemplate
) {
    fun listarUsuariosAll(
        params: FiltroListarUsuariosAllDto
    ): List<ListarUsuariosBasicInfoDto> =
        ListarUsuariosAllSql(params).query(template)

    fun deletarUsuario(id: Long) = DeletarAccountSql(id).executeStatement(template)
}