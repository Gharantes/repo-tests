package com.example.synergia.rest.pageDetalhesProjeto.dto.output

data class ProjectDetailsDto(
    val id: Long,
    val title: String,
    val description: String?,
    val urlBanner: String?
)
