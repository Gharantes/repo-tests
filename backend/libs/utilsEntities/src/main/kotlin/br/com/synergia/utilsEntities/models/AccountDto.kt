package br.com.synergia.utilsEntities.models

data class AccountDto (
    val id: Long,
    val idTenant: Long,
    val login: String,
    val email: String,
    val firstName: String,
    val lastName: String
)