package com.example.synergia.repositories.byDomain.statistics

import com.example.synergia.domain.statistics.StatisticsViewsEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query

interface StatisticsViewsRepository : JpaRepository<StatisticsViewsEntity, Long> {
    @Transactional
    @Modifying
    @Query("""
        DELETE FROM statistics_views 
        WHERE at < CURRENT_DATE
    """, nativeQuery = true)
    fun deleteAllFromPast()
}