package com.example.synergia.rest.byPage

import com.example.synergia.models.byPage.pageCreateUsuario.dto.input.CreateUsuarioDto
import com.example.synergia.models.byPage.pageCreateUsuario.dto.input.UpdateUsuarioDto
import com.example.synergia.services.byPage.PageCreateUsuarioService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/create-usuario")
class PageCreateUsuarioResource (
    private val service: PageCreateUsuarioService
) {
    @GetMapping("{id}")
    fun getCreateUsuarioDtoById(
        @PathVariable("id") id: Long
    ): ResponseEntity<CreateUsuarioDto?> = ResponseMessenger.buildResponse {
        service.getCreateUsuarioDtoById(id)
    }
    @PostMapping("store")
    fun createUsuario(
        @RequestBody params: CreateUsuarioDto
    ): ResponseEntity<Void> = ResponseMessenger.responseWithoutReturn {
        service.createUsuario(params)
    }
    @PostMapping("update")
    fun updateUser(
        @RequestBody params: UpdateUsuarioDto
    ): ResponseEntity<Void> = ResponseMessenger.responseWithoutReturn {
        service.updateUser(params)
    }
}