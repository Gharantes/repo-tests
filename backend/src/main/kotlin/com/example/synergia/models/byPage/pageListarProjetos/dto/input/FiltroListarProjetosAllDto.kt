package com.example.synergia.models.byPage.pageListarProjetos.dto.input

data class FiltroListarProjetosAllDto(
    val idTenant: Long,
    val idAccount: Long,
    val text: String? = null
)
