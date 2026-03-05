package br.com.synergia.pageListUsuarios.models

data class ListarUsuariosBasicInfoDto(
    val idAccount: Long,
    val login: String,
    val idPerson: Long?,
    val firstName: String?,
    val lastName: String?
)
