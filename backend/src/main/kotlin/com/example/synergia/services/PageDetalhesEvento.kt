package com.example.synergia.services

import com.example.synergia.pageRepositories.pageDetalhesEvento.ListarProjetosOfEventoSql
import com.example.synergia.rest.pageDetalhesEvento.dto.input.FiltroListarProjetosOfEventoDto
import com.example.synergia.rest.pageDetalhesEvento.dto.output.ListarProjetosOfEventoDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageDetalhesEvento (
    private val template: NamedParameterJdbcTemplate
) {
    fun listarProjetosOfEvento(
        params: FiltroListarProjetosOfEventoDto
    ): List<ListarProjetosOfEventoDto> =
        ListarProjetosOfEventoSql(params).query(template)
}