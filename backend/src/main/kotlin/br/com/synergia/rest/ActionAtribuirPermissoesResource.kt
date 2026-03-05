package br.com.synergia.rest

import br.com.synergia.actionAtribuirPermissoes.models.AtribuirPermissoesDto
import br.com.synergia.actionAtribuirPermissoes.services.ActionAtribuirPermissoesService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/action-atribuir-permissoes")
class ActionAtribuirPermissoesResource (
    private val service: ActionAtribuirPermissoesService
) {
    @PostMapping("atribuir-permissoes")
    fun atribuirPermissoes(
        @RequestBody params: AtribuirPermissoesDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.atribuirPermissoes(params) }
    }
}