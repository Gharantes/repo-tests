package br.com.synergia.rest

import br.com.synergia.pageListUsuarios.models.ListarUsuariosBasicInfoDto
import br.com.synergia.pageListUsuarios.services.PageListUsuariosService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-list-usuarios")
class PageListUsuariosResource (
    private val service: PageListUsuariosService
) {
    @PostMapping("/listar-usuarios")
    fun listarUsuarios(
        @PathVariable("id-tenant") idTenant: Long
    ): ResponseEntity<List<ListarUsuariosBasicInfoDto>> {
        return ResponseMessenger.buildResponse { service.listarUsuarios(idTenant) }
    }

    @DeleteMapping("/deletar-usuario/{id-usuario}")
    fun deletarUsuario(
        @PathVariable("id-usuario") idUsuario: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.deletarUsuario(idUsuario)
        }
    }
}