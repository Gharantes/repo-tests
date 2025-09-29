package com.example.synergia.domain.statistics

import com.example.synergia.utils.enums.EntityRefEnum
import jakarta.persistence.*
import java.time.LocalDate
import java.time.LocalDateTime

@Entity @Table(name = "statistics_views")
data class StatisticsAnonimizedViewsEntity (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long,
    @Column(name = "id_ref", nullable = false) val idRef: Long,
    @Column(name = "entity_ref", nullable = false) @Enumerated(EnumType.STRING) val entityRef: EntityRefEnum,
    @Column(name = "at") val at: LocalDate
)