package com.example.synergia.models.byPage.pageListarProjetos.dto.output

data class ListarProjetosAllDto(
    val id: Long,
    val title: String,
    val description: String,
    val createdByIdAccount: Long,
    val createdByNameAccount: String,
    val bannerUrl: String?,
    val userIsMember: Boolean
)
