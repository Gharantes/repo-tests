package com.example.synergia

import com.example.synergia.domain.system.InitActionsHistoryEntity
import com.example.synergia.repositories.byDomain.system.InitActionsHistoryRepository
import com.example.synergia.repositories.byDomain.statistics.StatisticsViewsRepository
import com.example.synergia.repositories.statistics.AnonimizeViewsSql
import com.example.synergia.utils.enums.ActionRefEnum
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class InitService (
    private val initActionsHistoryRepository: InitActionsHistoryRepository,
    private val statisticsViewsRepository: StatisticsViewsRepository,
    private val template: NamedParameterJdbcTemplate
) {

    fun checkActions() {
        ActionRefEnum.entries.forEach { actionRef ->
            val state = initActionsHistoryRepository.checkIfActionExecutedToday(actionRef.name)

            when (state) {
                true -> {
                    val action = initActionsHistoryRepository.findByActionRef(actionRef)!!
                    executeAction(action)
                    updateAction(action)
                }
                false -> {} // Do nothing
                null -> {
                    val action = createEntity(actionRef)
                    executeAction(action)
                    updateAction(action)
                }
            }
        }
    }

    private fun createEntity(action: ActionRefEnum): InitActionsHistoryEntity {
        val entity = InitActionsHistoryEntity(
            actionRef = action,
            lastExecutedAt = LocalDate.of(1999, 1, 1).atStartOfDay()
        )
        return initActionsHistoryRepository.save(entity)
    }
    private fun executeAction(action: InitActionsHistoryEntity) {
        when (action.actionRef) {
            ActionRefEnum.ANONIMIZE_VIEWS -> anonimizePastData()
        }
    }
    private fun updateAction(action: InitActionsHistoryEntity) {
        action.lastExecutedAt = LocalDateTime.now()
        initActionsHistoryRepository.save(action)
        println("EXECUTED ${action.actionRef.name}")
    }
    private fun anonimizePastData() {
        AnonimizeViewsSql().executeStatement(template)
        statisticsViewsRepository.deleteAllFromPast()
    }
}