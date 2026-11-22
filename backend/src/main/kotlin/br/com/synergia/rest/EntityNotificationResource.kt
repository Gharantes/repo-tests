package br.com.synergia.rest

import br.com.synergia.libs.entityNotification.services.EntityNotificationService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.NotificationDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-notification")
class EntityNotificationResource (
    private val service: EntityNotificationService
) {
    @PostMapping("/list-notifications-of-account")
    fun listNotificationsOfAccount(
        @RequestParam("id-account") idAccount: Long,
        @RequestParam("limit", required = false) limit: Int? = null
    ): ResponseEntity<List<NotificationDto>> {
        return ResponseMessenger.buildResponse {
            service.listNotificationsOfAccount(idAccount, limit)
        }
    }
    @PostMapping("/count-unread")
    fun countUnread(
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Long> {
        return ResponseMessenger.buildResponse {
            service.countUnread(idAccount)
        }
    }
    @PostMapping("mark-as-read/{id-notification}")
    fun markAsRead(
        @PathVariable("id-notification") idNotification: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.markAsRead(idNotification, idAccount)
        }
    }
    @PostMapping("mark-all-as-read")
    fun markAllAsRead(
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.markAllAsRead(idAccount)
        }
    }
}
