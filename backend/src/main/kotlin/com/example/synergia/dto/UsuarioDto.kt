package com.example.synergia.dto

data class UsuarioDto (
    var idUsuario: Long,
    var name: String,
    var email: String,
    var permissoes: List<Long>,

)