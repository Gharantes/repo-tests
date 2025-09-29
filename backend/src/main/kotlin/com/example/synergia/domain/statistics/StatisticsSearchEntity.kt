package com.example.synergia.domain.statistics

import com.example.synergia.utils.enums.EntityRefEnum
import com.example.synergia.utils.enums.PageRefEnum
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "statistics_search")
data class StatisticsSearchEntity (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long? = null,
    @Column(name = "id_tenant", nullable = false) val idTenant: Long,
    @Column(name = "id_account", nullable = false) val idAccount: Long,
    @Column(name = "page_ref", nullable = false) @Enumerated(EnumType.STRING) val pageRef: PageRefEnum,
    @Column(name = "param", nullable = false) val param: String? = null,
    @Column(name = "value", nullable = false) val value: String? = null,
    @Column(name = "at") val at: LocalDateTime = LocalDateTime.now()
)