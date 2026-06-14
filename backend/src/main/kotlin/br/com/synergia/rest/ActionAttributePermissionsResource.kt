package br.com.synergia.rest

import br.com.synergia.libs.actionAttributePermissions.models.AttributePermissionsDto
import br.com.synergia.libs.actionAttributePermissions.services.ActionAttributePermissionsService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/action-attribute-permissions")
class ActionAttributePermissionsResource (
    private val service: ActionAttributePermissionsService
) {
    @PostMapping("attribute-permissions")
    fun attributePermissions(
        @RequestBody params: AttributePermissionsDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.attributePermissions(params) }
    }
}