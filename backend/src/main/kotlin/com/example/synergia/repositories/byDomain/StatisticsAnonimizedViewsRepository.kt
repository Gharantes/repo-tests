package com.example.synergia.repositories.byDomain

import com.example.synergia.domain.statistics.StatisticsAnonimizedViewsEntity
import org.springframework.data.jpa.repository.JpaRepository

interface StatisticsAnonimizedViewsRepository : JpaRepository<StatisticsAnonimizedViewsEntity, Long>