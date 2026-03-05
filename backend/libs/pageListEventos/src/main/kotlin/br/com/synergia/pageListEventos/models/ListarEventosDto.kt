package br.com.synergia.pageListEventos.models

data class ListarEventosDto(
    val id: Long,
    val title: String,
    val description: String,
    val createdByIdAccount: Long,
    val createdByNameAccount: String,
    val bannerUrl: String?,
    val userIsMember: Boolean
)
