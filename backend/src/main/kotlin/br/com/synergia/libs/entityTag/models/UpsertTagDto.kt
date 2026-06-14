package br.com.synergia.libs.entityTag.models

data class UpsertTagDto(
    val idTenant: Long,
    val title: String,
    val forProjects: Boolean,
    val forEvents: Boolean,
    val forAccounts: Boolean
)