package com.example.synergia.models.byPage.pageCreateProjeto.dto.input

data class CreateProjetoDto(
    val idTenant: Long,
    val idAccount: Long,
    val title: String,
    val description: String,
    val urlBanner: String? = null
)
