package br.com.synergia.libs.pageLogin.models

data class LoginInformationResponseDto (
    val idAccount: Long,
    val idTenant: Long,
    val login: String,
    val tenantTitle: String,
    val firstName: String?,
    val lastName: String?,
    /** Token da sessão aberta pelo login. O frontend manda em `Authorization: Bearer ...`. */
    val token: String? = null,
)
