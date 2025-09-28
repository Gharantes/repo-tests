package com.example.synergia.repositories.byDomain

import com.example.synergia.domain.statistics.StatisticsViewsEntity
import org.springframework.data.jpa.repository.JpaRepository

interface StatisticsViewsRepository : JpaRepository<StatisticsViewsEntity, Long>