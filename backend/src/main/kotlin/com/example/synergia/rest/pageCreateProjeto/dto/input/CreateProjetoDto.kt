package com.example.synergia.rest.pageCreateProjeto.dto.input

data class CreateProjetoDto(
    val idTenant: Long,
    val idAccount: Long,
    val title: String,
    val description: String,
    val urlBanner: String? = null
)
