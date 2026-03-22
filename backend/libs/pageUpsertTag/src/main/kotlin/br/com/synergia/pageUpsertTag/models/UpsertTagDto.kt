package br.com.synergia.pageUpsertTag.models

import java.time.LocalDateTime

data class UpsertTagDto(
    val idTenant: Long,
    val title: String,
    val forProjects: Boolean,
    val forEvents: Boolean,
    val forAccounts: Boolean
)
