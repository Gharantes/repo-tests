package br.com.synergia.pageUpsertEvents.models

data class UpsertEventDto(
    val idAccount: Long,
    val idTenant: Long,
    val title: String,
    val description: String,
    val tags: List<Long>
)
