package br.com.synergia.entityEvent.models

data class UpsertEventDto(
    val idTenant: Long,
    val idAccount: Long,
    val title: String,
    val description: String,
    val bannerUrl: String?,
    val tags: List<Long>
)