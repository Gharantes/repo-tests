package com.example.synergia.rest.pageCreateUsuario

import com.example.synergia.rest.pageCreateUsuario.dto.input.CreateUsuarioDto
import com.example.synergia.services.PageCreateTenantService
import com.example.synergia.services.PageCreateUsuarioService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/create-usuario")
class PageCreateUsuarioResource (
    private val service: PageCreateUsuarioService
) {
    @PostMapping("store")
    fun createUsuario(
        @RequestBody params: CreateUsuarioDto
    ): ResponseEntity<Void> = ResponseMessenger.responseWithoutReturn {
        service.createUsuario(params)
    }
}