package br.com.synergia.rest

import br.com.synergia.libs.entityPermission.services.EntityPermissionService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.PermissionDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/entity-permission")
class EntityPermissionResource (
    private val service: EntityPermissionService
) {

    @PostMapping("/list-permissions")
    fun listPermissions(
        @RequestParam("text", required = false) text: String?
    ): ResponseEntity<List<PermissionDto>> {
        return ResponseMessenger.buildResponse {
            service.listPermissions(text)
        }
    }
}