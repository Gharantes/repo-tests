package com.example.synergia.rest.pageListarEventos.dto.output

data class ListarEventosDto(
    val id: Long,
    val title: String,
    val description: String,
    val createdByIdAccount: Long,
    val createdByNameAccount: String,
    val bannerUrl: String?
)
