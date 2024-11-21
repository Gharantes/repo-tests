package com.example.synergia.dto.input

data class ProjectCreateDto (
    val idTenant: Long,
    val title: String,
    val description: String,
)