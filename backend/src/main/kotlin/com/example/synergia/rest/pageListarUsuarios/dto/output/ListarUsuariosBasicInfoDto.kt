package com.example.synergia.rest.pageListarUsuarios.dto.output

data class ListarUsuariosBasicInfoDto(
    val idAccount: Long,
    val login: String,
    val idPerson: Long?,
    val firstName: String?,
    val lastName: String?
)
