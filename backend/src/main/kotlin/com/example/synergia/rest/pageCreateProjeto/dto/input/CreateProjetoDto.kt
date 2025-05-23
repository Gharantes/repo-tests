package com.example.synergia.rest.pageCreateProjeto.dto.input

data class CreateProjetoDto(
    val idTenant: Long,
    val title: String,
    val description: String,
    val eventosSelecionados: List<Long>
)
