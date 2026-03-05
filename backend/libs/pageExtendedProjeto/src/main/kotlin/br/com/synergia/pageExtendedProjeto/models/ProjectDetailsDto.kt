package br.com.synergia.pageExtendedProjeto.models

data class ProjectDetailsDto(
    val id: Long,
    val title: String,
    val description: String?,
    val urlBanner: String?
)