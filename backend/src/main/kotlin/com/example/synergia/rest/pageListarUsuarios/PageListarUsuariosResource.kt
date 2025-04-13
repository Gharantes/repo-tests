package com.example.synergia.rest.pageListarUsuarios

import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosBasicInfoDto
import com.example.synergia.rest.pageListarUsuarios.dto.output.ListarUsuariosBasicInfoDto
import com.example.synergia.services.PageListarEventosService
import com.example.synergia.services.PageListarUsuariosService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/listar-usuarios")
class PageListarUsuariosResource (
    private val service: PageListarUsuariosService
) {
    @GetMapping("/all")
    fun listarUsuariosAll(): ResponseEntity<List<ListarUsuariosBasicInfoDto>> =
        ResponseMessenger.buildResponse {
            service.listarUsuariosAll()
        }
}