package com.example.synergia.domain.system

import com.example.synergia.utils.enums.ActionRefEnum
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity @Table(name = "init_actions_history ")
data class InitActionsHistoryEntity (
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "action_ref", nullable = false)
    var actionRef: ActionRefEnum,

    @Column(name = "last_executed_at", nullable = false)
    var lastExecutedAt: LocalDateTime
)