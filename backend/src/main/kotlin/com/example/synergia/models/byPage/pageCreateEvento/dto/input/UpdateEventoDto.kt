package com.example.synergia.models.byPage.pageCreateEvento.dto.input

data class UpdateEventoDto(
    val id: Long,
    val idTenant: Long,
    val title: String,
    val description: String,
    val urlBanner: String?
)
