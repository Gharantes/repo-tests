package br.com.synergia.rest

import br.com.synergia.libs.entityJoinRequest.services.EntityJoinRequestService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-join-request")
class EntityJoinRequestResource (
    private val service: EntityJoinRequestService
) {
    @PostMapping("/has-pending-request")
    fun hasPendingRequest(
        @RequestParam("id-project") idProject: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Boolean> {
        return ResponseMessenger.buildResponse { service.hasPendingRequest(idProject, idAccount) }
    }
    @PostMapping("/request")
    fun requestToJoin(
        @RequestParam("id-project") idProject: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Long> {
        return ResponseMessenger.buildResponse { service.requestToJoin(idProject, idAccount) }
    }
    @PostMapping("/cancel")
    fun cancelRequest(
        @RequestParam("id-project") idProject: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.cancelRequest(idProject, idAccount) }
    }
    @PostMapping("/accept/{id-request}")
    fun acceptRequest(
        @PathVariable("id-request") idRequest: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.acceptRequest(idRequest, idAccount) }
    }
    @PostMapping("/decline/{id-request}")
    fun declineRequest(
        @PathVariable("id-request") idRequest: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.declineRequest(idRequest, idAccount) }
    }
}
