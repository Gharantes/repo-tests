package br.com.synergia.rest

import br.com.synergia.actionAtribuirPermissoes.models.ListarPermissoesDto
import br.com.synergia.pageListPermissoes.services.PageListPermissoesService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/page-list-permissoes")
class PageListPermissoesResource (
    private val service: PageListPermissoesService
) {
    @PostMapping("/listar-permissoes")
    fun listarPermissoes(): ResponseEntity<List<ListarPermissoesDto>> {
        return ResponseMessenger.buildResponse { service.listarPermissoes() }
    }
}