package com.example.synergia.rest.pageLogin.dto.input

data class LoginInformationInputDto(
    val idTenant: Long,
    val login: String,
    val password: String,
    val checkLastSeen: Boolean
)