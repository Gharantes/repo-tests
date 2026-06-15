package br.com.synergia.libs.utilsEntities.models

data class AccountDto (
    val id: Long,
    val idTenant: Long,
    val login: String,
    val email: String?,
    val firstName: String,
    val lastName: String,
    var tags: List<TagDto> = emptyList()
)