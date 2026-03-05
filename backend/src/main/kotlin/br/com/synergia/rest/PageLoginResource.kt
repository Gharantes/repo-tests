package br.com.synergia.rest

import br.com.synergia.pageLogin.models.LoginInformationInputDto
import br.com.synergia.pageLogin.models.LoginInformationResponseDto
import br.com.synergia.pageLogin.models.LoginTenantInformationDto
import br.com.synergia.pageLogin.services.PageLoginService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-login")
class PageLoginResource (
    private val service: PageLoginService
) {
    @GetMapping("/listar-tenants")
    fun listarTenantsLogin(): ResponseEntity<List<LoginTenantInformationDto>> {
        return ResponseMessenger.buildResponse { service.listarTenantsLogin() }
    }

    @PostMapping("/check-login-information")
    fun checkLoginInformation(
        @RequestBody params: LoginInformationInputDto
    ): ResponseEntity<LoginInformationResponseDto?> {
        return ResponseMessenger.buildResponse { service.checkLoginInformation(params) }
    }
}