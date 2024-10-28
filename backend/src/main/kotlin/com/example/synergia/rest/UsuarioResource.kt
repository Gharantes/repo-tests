package com.example.synergia.rest

import com.example.synergia.dto.UsuarioDto
import com.example.synergia.services.UsuarioService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/test")
class UsuarioResource (
    private val usuarioService: UsuarioService,
) {
    @GetMapping("getById/{idUsuario}")
    fun getUsuarioById(
        @PathVariable("idUsuario") idUsuario: Long
    ): UsuarioDto? {
        return usuarioService.getById(idUsuario);
    }
    @GetMapping("getAll")
    fun getAllUsuarios(): List<UsuarioDto> {
        return usuarioService.getAll();
    }
}