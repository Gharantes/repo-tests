package br.com.synergia.rest

import br.com.synergia.pageListPermissoes.services.PageListPermissionsService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.PermissionDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/page-list-permissions")
class PageListPermissionsResource (
    private val service: PageListPermissionsService
) {
    @PostMapping("/list-permissions")
    fun listPermissions(): ResponseEntity<List<PermissionDto>> {
        return ResponseMessenger.buildResponse { service.listPermissions() }
    }
}