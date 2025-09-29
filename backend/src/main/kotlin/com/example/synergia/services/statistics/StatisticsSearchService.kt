package com.example.synergia.services.statistics

import com.example.synergia.domain.statistics.StatisticsSearchEntity
import com.example.synergia.models.byPage.pageListarEventos.dto.input.FiltroListarEventosAllDto
import com.example.synergia.models.byPage.pageListarProjetos.dto.input.FiltroListarProjetosAllDto
import com.example.synergia.repositories.byDomain.statistics.StatisticsSearchRepository
import com.example.synergia.utils.enums.PageRefEnum
import org.springframework.stereotype.Service

@Service
class StatisticsSearchService (
    private val statisticsSearchRepository: StatisticsSearchRepository
) {
    fun createFromFiltroListarEventosAllDto(
        params: FiltroListarEventosAllDto
    ) {
        val base = StatisticsSearchEntity(
            idTenant = params.idTenant,
            idAccount = params.idAccount,
            pageRef = PageRefEnum.LISTAR_EVENTOS
        )
        if (!params.text.isNullOrBlank()) {
            val new = base.copy(param = "TEXT", value = params.text)
            statisticsSearchRepository.save(new)
        }
    }

    fun createFromFiltroListarProjetosAllDto(
        params: FiltroListarProjetosAllDto
    ) {
        val base = StatisticsSearchEntity(
            idTenant = params.idTenant,
            idAccount = params.idAccount,
            pageRef = PageRefEnum.LISTAR_PROJETOS
        )
        if (!params.text.isNullOrBlank()) {
            val new = base.copy(param = "TEXT", value = params.text)
            statisticsSearchRepository.save(new)
        }
    }
}