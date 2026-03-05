package br.com.synergia.rest

import br.com.synergia.actionManageRelationships.services.ActionManageRelationshipsService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/action-manage-relationships")
class ActionManageRelationshipsResource (
    private val service: ActionManageRelationshipsService
) {
    @PostMapping("/create-relationship-evento-and-projeto")
    fun createRelationshipEventoAndProjeto(
        @RequestParam("id-evento") idEvento: Long,
        @RequestParam("id-projeto") idProjeto: Long,
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.createRelationshipEventoAndProjeto(idEvento, idProjeto) }
    }
    @PostMapping("/remove-relationship-evento-and-projeto")
    fun removeRelationshipEventoAndProjeto(
        @RequestParam("id-evento") idEvento: Long,
        @RequestParam("id-projeto") idProjeto: Long,
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.removeRelationshipEventoAndProjeto(idEvento, idProjeto) }
    }
    @PostMapping("/create-relationship-tag-and-projeto")
    fun createRelationshipTagAndProjeto(
        @RequestParam("id-tag") idTag: Long,
        @RequestParam("id-projeto") idProjeto: Long,
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.createRelationshipTagAndProjeto(idTag, idProjeto) }
    }
}