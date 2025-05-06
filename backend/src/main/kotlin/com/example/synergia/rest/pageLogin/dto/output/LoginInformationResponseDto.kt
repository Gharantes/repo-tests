package com.example.synergia.rest.pageLogin.dto.output

data class LoginInformationResponseDto (
    val idAccount: Long,
    val login: String,
    val idPerson: Long?,
    val firstName: String?,
    val lastName: String?
)