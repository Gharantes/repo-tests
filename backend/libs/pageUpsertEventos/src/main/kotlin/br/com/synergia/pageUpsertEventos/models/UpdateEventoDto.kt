package br.com.synergia.pageUpsertEventos.models

data class UpdateEventoDto(
    val id: Long,
    val idTenant: Long,
    val title: String,
    val description: String,
    val urlBanner: String?,
    val tags: List<Long>
)
