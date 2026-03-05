package br.com.synergia.pageUpsertUsuario.models

data class CreateUsuarioDto(
    val idTenant: Long,
    val login: String,
    val password: String,
    val firstName: String,
    val lastName: String
)
