package com.example.synergia.rest.pageListarTags.dto.output

import java.time.LocalDate
import java.time.LocalDateTime

data class ListarTagDto(
    val id: Long,
    val name: String,
    val createdAt: LocalDateTime
)
