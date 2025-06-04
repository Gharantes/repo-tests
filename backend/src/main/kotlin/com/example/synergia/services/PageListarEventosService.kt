package com.example.synergia.services

import com.example.synergia.repositories.pageListarEventos.DeletarEventoSql
import com.example.synergia.repositories.pageListarEventos.ListarEventosAllSql
import com.example.synergia.repositories.pageListarEventos.ListarEventosByIdSql
import com.example.synergia.rest.pageListarEventos.dto.input.FiltroListarEventosAllDto
import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarEventosService (
    private val template: JdbcTemplate
) {
    fun listarEventosAll(
        params: FiltroListarEventosAllDto
    ): List<ListarEventosDto> =
        ListarEventosAllSql(params).query(template)

    fun deletarEvento(id: Long) = DeletarEventoSql(id).executeStatement(template)

    fun listarEventosById(id: Long): ListarEventosDto? =
        ListarEventosByIdSql(id).queryForObject(template)

}