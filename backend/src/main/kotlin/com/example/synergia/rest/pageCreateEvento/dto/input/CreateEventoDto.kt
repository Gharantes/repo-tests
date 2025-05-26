package com.example.synergia.rest.pageCreateEvento.dto.input

data class CreateEventoDto(
    val idTenant: Long,
    val title: String,
    val description: String,
    val createdByIdAccount: Long,
    val urlBanner: String?
)
