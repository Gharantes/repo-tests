package br.com.synergia.libs.utilsEntities.models

import java.time.LocalDateTime

data class TagDto(
    val id: Long,
    val idTenant: Long,
    val title: String,
    val createdAt: LocalDateTime,
    val forProjects: Boolean,
    val forEvents: Boolean,
    val forAccounts: Boolean
)
