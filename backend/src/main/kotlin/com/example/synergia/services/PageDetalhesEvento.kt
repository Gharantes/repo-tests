package com.example.synergia.services

import com.example.synergia.repositories.pageDetalhesEvento.ListarProjetosOfEventoSql
import com.example.synergia.rest.pageDetalhesEvento.dto.input.FiltroListarProjetosOfEventoDto
import com.example.synergia.rest.pageDetalhesEvento.dto.output.ListarProjetosOfEventoDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageDetalhesEvento (
    private val template: JdbcTemplate
) {
    fun listarProjetosOfEvento(
        params: FiltroListarProjetosOfEventoDto
    ): List<ListarProjetosOfEventoDto> =
        ListarProjetosOfEventoSql(params).query(template)
}