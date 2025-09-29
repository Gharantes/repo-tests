package com.example.synergia.models.byPage.pageListarEventos.dto.input

data class FiltroListarEventosAllDto(
    val idTenant: Long,
    val idAccount: Long,
    val text: String? = null
)
