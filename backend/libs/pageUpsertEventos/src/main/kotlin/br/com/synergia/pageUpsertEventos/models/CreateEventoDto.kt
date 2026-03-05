package br.com.synergia.pageUpsertEventos.models

data class CreateEventoDto(
    val idTenant: Long,
    val idAccount: Long,
    val title: String,
    val description: String,
    val urlBanner: String?,
    val tags: List<Long>
)
