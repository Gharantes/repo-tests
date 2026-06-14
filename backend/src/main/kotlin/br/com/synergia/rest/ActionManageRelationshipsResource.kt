package br.com.synergia.rest

import br.com.synergia.libs.actionManageRelationships.services.ActionManageRelationshipsService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
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
    @PostMapping("/create-relationship-event-and-project")
    fun createRelationshipEventAndProject(
        @RequestParam("id-event") idEvent: Long,
        @RequestParam("id-project") idProject: Long,
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.createRelationshipEventAndProject(idEvent, idProject) }
    }
    @PostMapping("/remove-relationship-event-and-project")
    fun removeRelationshipEventAndProject(
        @RequestParam("id-event") idEvent: Long,
        @RequestParam("id-project") idProject: Long,
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.removeRelationshipEventAndProject(idEvent, idProject) }
    }
    @PostMapping("/create-relationship-tag-and-project")
    fun createRelationshipTagAndProject(
        @RequestParam("id-tag") idTag: Long,
        @RequestParam("id-project") idProjeto: Long,
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.createRelationshipTagAndProject(idTag, idProjeto) }
    }
}