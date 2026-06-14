package br.com.synergia.libs.pageLogin.models

data class LoginInformationInputDto(
    val idTenant: Long,
    val login: String,
    val password: String,
    val checkLastSeen: Boolean
)