package br.com.synergia.rest

import br.com.synergia.libs.entityMessage.models.SendMessageDto
import br.com.synergia.libs.entityMessage.services.EntityMessageService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.ConversationDto
import br.com.synergia.libs.utilsEntities.models.ConversationMemberDto
import br.com.synergia.libs.utilsEntities.models.MessageContactDto
import br.com.synergia.libs.utilsEntities.models.MessageDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-message")
class EntityMessageResource (
    private val service: EntityMessageService
) {
    @PostMapping("/list-conversations")
    fun listConversations(
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<List<ConversationDto>> {
        return ResponseMessenger.buildResponse {
            service.listConversations(idAccount)
        }
    }
    @PostMapping("/count-unread")
    fun countUnread(
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Int> {
        return ResponseMessenger.buildResponse {
            service.countUnread(idAccount)
        }
    }
    @PostMapping("/list-contacts")
    fun listContacts(
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<List<MessageContactDto>> {
        return ResponseMessenger.buildResponse {
            service.listContacts(idAccount)
        }
    }
    @PostMapping("/list-members/{id-conversation}")
    fun listMembers(
        @PathVariable("id-conversation") idConversation: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<List<ConversationMemberDto>> {
        return ResponseMessenger.buildResponse {
            service.listMembers(idConversation, idAccount)
        }
    }
    @PostMapping("/list-messages/{id-conversation}")
    fun listMessages(
        @PathVariable("id-conversation") idConversation: Long,
        @RequestParam("id-account") idAccount: Long,
        @RequestParam("after-id", required = false) afterId: Long? = null,
        @RequestParam("before-id", required = false) beforeId: Long? = null,
        @RequestParam("limit", required = false) limit: Int? = null
    ): ResponseEntity<List<MessageDto>> {
        return ResponseMessenger.buildResponse {
            service.listMessages(idConversation, idAccount, afterId, beforeId, limit)
        }
    }
    @PostMapping("/send/{id-conversation}")
    fun sendMessage(
        @PathVariable("id-conversation") idConversation: Long,
        @RequestBody params: SendMessageDto
    ): ResponseEntity<MessageDto> {
        return ResponseMessenger.buildResponse {
            service.sendMessage(idConversation, params)
        }
    }
    @PostMapping("/mark-as-read/{id-conversation}")
    fun markAsRead(
        @PathVariable("id-conversation") idConversation: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.markAsRead(idConversation, idAccount)
        }
    }
    @PostMapping("/open-direct")
    fun openDirectConversation(
        @RequestParam("id-account") idAccount: Long,
        @RequestParam("id-other") idOther: Long
    ): ResponseEntity<Long> {
        return ResponseMessenger.buildResponse {
            service.openDirectConversation(idAccount, idOther)
        }
    }
    @PostMapping("/open-project-event")
    fun openProjectEventConversation(
        @RequestParam("id-project") idProject: Long,
        @RequestParam("id-event") idEvent: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Long> {
        return ResponseMessenger.buildResponse {
            service.openProjectEventConversation(idProject, idEvent, idAccount)
        }
    }
    @PostMapping("/add-member/{id-conversation}")
    fun addMember(
        @PathVariable("id-conversation") idConversation: Long,
        @RequestParam("id-account") idAccount: Long,
        @RequestParam("id-member") idMember: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.addMember(idConversation, idAccount, idMember)
        }
    }
    @PostMapping("/remove-member/{id-conversation}")
    fun removeMember(
        @PathVariable("id-conversation") idConversation: Long,
        @RequestParam("id-account") idAccount: Long,
        @RequestParam("id-member") idMember: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.removeMember(idConversation, idAccount, idMember)
        }
    }
}
