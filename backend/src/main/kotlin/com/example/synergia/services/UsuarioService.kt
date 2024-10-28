package com.example.synergia.services

import com.example.synergia.dto.EventoDto
import com.example.synergia.dto.UsuarioDto
import org.springframework.stereotype.Service

@Service
class UsuarioService {
    fun getById(idUsuario: Long): UsuarioDto? {
        return getAll().firstOrNull { it.idUsuario == idUsuario }
    }
    fun getAll(): List<UsuarioDto> {
        return listOf(
            UsuarioDto(1, "1", "", listOf()),
            UsuarioDto(2, "2", "", listOf()),
        )
    }
}