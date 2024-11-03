package com.example.synergia.dto.output

import com.example.synergia.dto.enums.TipoUsuario

data class InfoPessoaSimplesDto(
    var id: Long,
    var nome: String,
    var emailContato: String,
    var tipoUsuario: TipoUsuario,
)
