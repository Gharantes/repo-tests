package com.example.synergia.services.byPage

import com.example.synergia.repositories.byDomain.EventRepository
import com.example.synergia.repositories.byDomain.relationships.ProjectEventRelationshipRepository
import com.example.synergia.repositories.byPage.pageListarEventos.ListarEventosAllSql
import com.example.synergia.repositories.byPage.pageListarEventos.ListarEventosByIdSql
import com.example.synergia.models.byPage.pageListarEventos.dto.input.FiltroListarEventosAllDto
import com.example.synergia.models.byPage.pageListarEventos.dto.input.FiltroListarEventosByIdDto
import com.example.synergia.models.byPage.pageListarEventos.dto.output.ListarEventosDto
import com.example.synergia.repositories.byDomain.statistics.StatisticsSearchRepository
import com.example.synergia.services.statistics.StatisticsSearchService
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarEventosService (
    private val template: NamedParameterJdbcTemplate,
    private val eventRepository: EventRepository,
    private val projectEventRelationshipRepository: ProjectEventRelationshipRepository,
    private val statisticsSearchService: StatisticsSearchService
) {
    fun listarEventosAll(
        params: FiltroListarEventosAllDto
    ): List<ListarEventosDto> {
        statisticsSearchService.createFromFiltroListarEventosAllDto(params)
        return ListarEventosAllSql(params).query(template)
    }

    fun deletarEvento(id: Long) {
        projectEventRelationshipRepository.deleteByIdEvent(id)
        eventRepository.deleteById(id)
    }

    fun listarEventosById(params: FiltroListarEventosByIdDto): ListarEventosDto? =
        ListarEventosByIdSql(params).queryForObject(template)
}