package br.com.synergia.pageListEventos.models

data class FiltroListarEventosAllDto(
    val idTenant: Long,
    val idAccount: Long,
    val text: String? = null
)
