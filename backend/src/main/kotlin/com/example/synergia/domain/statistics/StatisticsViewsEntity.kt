package com.example.synergia.domain.statistics

import com.example.synergia.utils.enums.EntityRefEnum
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity @Table(name = "statistics_views")
data class StatisticsViewsEntity (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long? = null,
    @Column(name = "id_tenant", nullable = false) val idTenant: Long,
    @Column(name = "id_account", nullable = false) val idAccount: Long,
    @Column(name = "id_ref", nullable = false) val idRef: Long,
    @Column(name = "entity_ref", nullable = false) @Enumerated(EnumType.STRING) val entityRef: EntityRefEnum,
    @Column(name = "at") val at: LocalDateTime = LocalDateTime.now()
)