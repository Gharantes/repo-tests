package com.example.synergia.rest.pageListarUsuarios

import com.example.synergia.rest.pageListarUsuarios.dto.input.FiltroListarUsuariosAllDto
import com.example.synergia.rest.pageListarUsuarios.dto.output.ListarUsuariosBasicInfoDto
import com.example.synergia.services.PageListarUsuariosService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/listar-usuarios")
class PageListarUsuariosResource (
    private val service: PageListarUsuariosService
) {
    @PostMapping("/all")
    fun listarUsuariosAll(
        @RequestBody params: FiltroListarUsuariosAllDto
    ): ResponseEntity<List<ListarUsuariosBasicInfoDto>> =
        ResponseMessenger.buildResponse { service.listarUsuariosAll(params) }
}