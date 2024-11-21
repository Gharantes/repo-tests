package com.example.synergia.rest.location_specific

import com.example.synergia.dto.entity_mirror.AccountDto
import com.example.synergia.dto.output.login_page.TenantLoginPageConfigInfoDto
import com.example.synergia.services.location_specific.LoginPageService
import com.example.synergia.utils.objects.MediaTypes
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/login")
class LoginPageResource (
    private val loginPageService: LoginPageService
) {
    @GetMapping(
        "authenticate-account/{id_tenant}",
        produces = [MediaTypes.JSON]
    ) fun authenticateAccount(
        @PathVariable("id_tenant") idTenant: Long,
        @RequestParam("login") login: String,
        @RequestParam("password") password: String,
    ): ResponseEntity<AccountDto> {
        return ResponseMessenger.buildResponse(null) {
            loginPageService.authenticateAccount(
                idTenant,
                login,
                password
            )
        }
    }

    @GetMapping("get-login-page-configurations-of-tenant/{id_tenant}")
    fun getLoginPageConfigurationsOfTenantByTenantId(
        @PathVariable("id_tenant") idTenant: Long,
    ): ResponseEntity<TenantLoginPageConfigInfoDto?> {
        return ResponseMessenger.buildResponse(null) {
            loginPageService.getLoginPageConfigurationsOfTenantByTenantId(idTenant);
        }
    }
}