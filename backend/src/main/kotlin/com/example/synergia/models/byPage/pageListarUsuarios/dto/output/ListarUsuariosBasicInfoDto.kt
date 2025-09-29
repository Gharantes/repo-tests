package com.example.synergia.models.byPage.pageListarUsuarios.dto.output

data class ListarUsuariosBasicInfoDto(
    val idAccount: Long,
    val login: String,
    val idPerson: Long?,
    val firstName: String?,
    val lastName: String?
)
