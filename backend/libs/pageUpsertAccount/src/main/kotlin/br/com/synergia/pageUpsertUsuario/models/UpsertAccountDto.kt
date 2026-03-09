package br.com.synergia.pageUpsertUsuario.models

data class UpsertAccountDto(
    val idTenant: Long,
    val email: String,
    val login: String,
    val password: String,
    val firstName: String,
    val lastName: String
)
