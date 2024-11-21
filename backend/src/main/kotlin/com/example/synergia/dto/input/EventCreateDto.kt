package com.example.synergia.dto.input

data class EventCreateDto(
    val idTenant: Long,
    val title: String,
    val description: String,
)
