package com.example.synergia.models.byPage.pageCreateUsuario.dto.input

data class CreateUsuarioDto(
    val idTenant: Long,
    val login: String,
    val password: String,
    val firstName: String,
    val lastName: String
)
