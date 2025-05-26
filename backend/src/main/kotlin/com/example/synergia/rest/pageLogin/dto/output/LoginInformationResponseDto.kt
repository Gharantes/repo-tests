package com.example.synergia.rest.pageLogin.dto.output

data class LoginInformationResponseDto (
    val idAccount: Long,
    val idTenant: Long,
    val idPerson: Long?,

    val login: String,
    val tenantTitle: String,
    val firstName: String?,
    val lastName: String?
)