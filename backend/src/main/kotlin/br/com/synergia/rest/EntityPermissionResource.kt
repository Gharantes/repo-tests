package br.com.synergia.rest

import br.com.synergia.libs.entityPermission.models.AccountPermissionsDetailDto
import br.com.synergia.libs.entityPermission.models.SetAccountPermissionsDto
import br.com.synergia.libs.entityPermission.models.UpsertPermissionProfileDto
import br.com.synergia.libs.entityPermission.services.EntityPermissionService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.PermissionDto
import br.com.synergia.libs.utilsEntities.models.PermissionProfileDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
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

    /** Permissões efetivas da conta (avulsas + perfis). */
    @GetMapping("/list-permissions-of-account")
    fun listPermissionsOfAccount(
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<List<PermissionDto>> {
        return ResponseMessenger.buildResponse {
            service.listPermissionsOfAccount(idAccount)
        }
    }

    /** Perfis e permissões avulsas da conta, separados. */
    @GetMapping("/get-account-permissions-detail")
    fun getAccountPermissionsDetail(
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<AccountPermissionsDetailDto> {
        return ResponseMessenger.buildResponse {
            service.getAccountPermissionsDetail(idAccount)
        }
    }

    @PostMapping("/set-account-permissions")
    fun setAccountPermissions(
        @RequestBody params: SetAccountPermissionsDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.setAccountPermissions(params)
        }
    }

    @PostMapping("/list-profiles")
    fun listProfiles(
        @RequestParam("id-tenant") idTenant: Long
    ): ResponseEntity<List<PermissionProfileDto>> {
        return ResponseMessenger.buildResponse {
            service.listProfiles(idTenant)
        }
    }

    @PostMapping("/create-profile")
    fun createProfile(
        @RequestBody params: UpsertPermissionProfileDto
    ): ResponseEntity<Long> {
        return ResponseMessenger.buildResponse {
            service.createProfile(params)
        }
    }

    @PostMapping("/update-profile/{id-profile}")
    fun updateProfile(
        @PathVariable("id-profile") idProfile: Long,
        @RequestBody params: UpsertPermissionProfileDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updateProfile(idProfile, params)
        }
    }

    @PostMapping("/delete-profile/{id-profile}")
    fun deleteProfile(
        @PathVariable("id-profile") idProfile: Long,
        @RequestParam("id-requester") idRequester: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.deleteProfile(idProfile, idRequester)
        }
    }
}
