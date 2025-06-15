package com.example.synergia.services

import com.example.synergia.domainRepositories.EventRepository
import com.example.synergia.domainRepositories.ProjectEventRelationshipRepository
import com.example.synergia.pageRepositories.pageListarEventos.ListarEventosAllSql
import com.example.synergia.pageRepositories.pageListarEventos.ListarEventosByIdSql
import com.example.synergia.rest.pageListarEventos.dto.input.FiltroListarEventosAllDto
import com.example.synergia.rest.pageListarEventos.dto.input.FiltroListarEventosByIdDto
import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarEventosService (
    private val template: NamedParameterJdbcTemplate,
    private val eventRepository: EventRepository,
    private val projectEventRelationshipRepository: ProjectEventRelationshipRepository
) {
    fun listarEventosAll(
        params: FiltroListarEventosAllDto
    ): List<ListarEventosDto> =
        ListarEventosAllSql(params).query(template)

    fun deletarEvento(id: Long) {
        projectEventRelationshipRepository.deleteByIdEvent(id)
        eventRepository.deleteById(id)
    }

    fun listarEventosById(params: FiltroListarEventosByIdDto): ListarEventosDto? =
        ListarEventosByIdSql(params).queryForObject(template)
}