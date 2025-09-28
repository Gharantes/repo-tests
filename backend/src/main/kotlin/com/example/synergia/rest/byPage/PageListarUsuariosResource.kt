package com.example.synergia.rest.byPage

import com.example.synergia.models.byPage.pageListarUsuarios.dto.input.FiltroListarUsuariosAllDto
import com.example.synergia.models.byPage.pageListarUsuarios.dto.output.ListarUsuariosBasicInfoDto
import com.example.synergia.services.byPage.PageListarUsuariosService
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

    @DeleteMapping("/delete/{id}")
    fun deletarUsuario(
        @PathVariable("id") id: Long
    ): ResponseEntity<Void> = ResponseMessenger.responseWithoutReturn {
        service.deletarUsuario(id)
    }
}