package com.example.synergia.rest.pageCreateUsuario.dto.input

data class UpdateUsuarioDto(
    val id: Long,
    val idTenant: Long,
    val login: String,
    val password: String,
    val firstName: String,
    val lastName: String
)
