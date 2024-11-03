package com.example.synergia.dto.entity_mirror

data class UsuarioDto (
    var idUsuario: Long,
    var name: String,
    var email: String,
    var permissoes: List<Long>,

)
