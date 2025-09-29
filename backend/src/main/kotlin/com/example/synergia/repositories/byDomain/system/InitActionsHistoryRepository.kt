package com.example.synergia.repositories.byDomain.system

import com.example.synergia.domain.system.InitActionsHistoryEntity
import com.example.synergia.utils.enums.ActionRefEnum
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface InitActionsHistoryRepository : JpaRepository<InitActionsHistoryEntity, Long> {
    @Query("""
        SELECT 
            last_executed_at::DATE < CURRENT_DATE
        FROM init_actions_history 
        WHERE action_ref = :action_ref
        LIMIT 1
    """, nativeQuery = true)
    fun checkIfActionExecutedToday(
        @Param("action_ref") actionRef: String
    ): Boolean?

    fun findByActionRef(actionRef: ActionRefEnum): InitActionsHistoryEntity?
}