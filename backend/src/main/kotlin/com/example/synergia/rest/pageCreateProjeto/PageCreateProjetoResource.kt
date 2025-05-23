package com.example.synergia.rest.pageCreateProjeto

import com.example.synergia.rest.pageCreateProjeto.dto.input.CreateProjetoDto
import com.example.synergia.services.PageCreateProjetoService
import com.example.synergia.services.PageCreateTenantService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/create-projeto")
class PageCreateProjetoResource (
    private val service: PageCreateProjetoService
) {
    @PostMapping("store")
    fun createProjeto(
        @RequestBody params: CreateProjetoDto
    ): ResponseEntity<Void> = ResponseMessenger.responseWithoutReturn {
        service.createProjeto(params)
    }
}