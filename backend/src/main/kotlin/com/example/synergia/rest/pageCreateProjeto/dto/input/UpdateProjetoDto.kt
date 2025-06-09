package com.example.synergia.rest.pageCreateProjeto.dto.input

data class UpdateProjetoDto (
    val id: Long,
    val idTenant: Long,
    val title: String,
    val description: String,
    val urlBanner: String?
)