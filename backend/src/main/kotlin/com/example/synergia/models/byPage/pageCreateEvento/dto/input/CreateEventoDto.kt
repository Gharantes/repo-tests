package com.example.synergia.models.byPage.pageCreateEvento.dto.input

data class CreateEventoDto(
    val idTenant: Long,
    val idAccount: Long,
    val title: String,
    val description: String,
    val urlBanner: String?
)
