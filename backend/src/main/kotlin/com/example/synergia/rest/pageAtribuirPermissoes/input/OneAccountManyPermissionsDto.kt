package com.example.synergia.rest.pageAtribuirPermissoes.input

data class OneAccountManyPermissionsDto (
    val idAccount: Long,
    val idPermissions: Long
)