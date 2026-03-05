package br.com.synergia.pageLogin.models

data class LoginInformationResponseDto (
    val idAccount: Long,
    val idTenant: Long,
    val idPerson: Long?,

    val login: String,
    val tenantTitle: String,
    val firstName: String?,
    val lastName: String?
)