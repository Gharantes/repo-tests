package com.example.synergia.services.statistics

import com.example.synergia.domain.statistics.StatisticsViewsEntity
import com.example.synergia.models.statistics.dto.input.RegisterViewDto
import com.example.synergia.repositories.byDomain.StatisticsViewsRepository
import org.springframework.stereotype.Service

@Service
class StatisticsService (
    private val statisticsViewsRepository: StatisticsViewsRepository
) {
    fun registerView(body: RegisterViewDto) {
        val entity = StatisticsViewsEntity(
            idTenant=body.idTenant,
            idAccount=body.idAccount,
            idRef=body.idRef,
            entityRef=body.entityRef,
        )
        statisticsViewsRepository.save(entity)
    }
}