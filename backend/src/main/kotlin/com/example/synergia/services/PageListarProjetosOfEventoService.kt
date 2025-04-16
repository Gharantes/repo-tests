package com.example.synergia.services

import com.example.synergia.repositories.pageListarProjetosOfEvento.ListarProjetosOfEventoSql
import com.example.synergia.rest.pageListarProjetosOfEvento.dto.input.FiltroListarProjetosOfEventoDto
import com.example.synergia.rest.pageListarProjetosOfEvento.dto.output.ListarProjetosOfEventoDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarProjetosOfEventoService (
    private val template: JdbcTemplate
) {
    fun listarProjetosOfEvento(
        params: FiltroListarProjetosOfEventoDto
    ): List<ListarProjetosOfEventoDto> =
        ListarProjetosOfEventoSql(params).query(template)
}