package br.com.synergia.pageLogin.models

data class LoginInformationInputDto(
    val idTenant: Long,
    val login: String,
    val password: String,
    val checkLastSeen: Boolean
)