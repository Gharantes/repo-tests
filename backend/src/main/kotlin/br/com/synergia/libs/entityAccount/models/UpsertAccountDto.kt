package br.com.synergia.libs.entityAccount.models

data class UpsertAccountDto(
    val idTenant: Long,
    val email: String,
    val login: String,
    val password: String,
    val firstName: String,
    val lastName: String,
    val tags: List<Long> = emptyList()
)