package br.com.synergia.rest

import br.com.synergia.pageLogin.models.LoginInformationInputDto
import br.com.synergia.pageLogin.models.LoginInformationResponseDto
import br.com.synergia.pageLogin.services.PageLoginService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.TenantDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-login")
class PageLoginResource (
    private val service: PageLoginService
) {
    @GetMapping("/listar-tenants")
    fun listarTenants(): ResponseEntity<List<TenantDto>> {
        return ResponseMessenger.buildResponse { service.listarTenants() }
    }

    @PostMapping("/check-login-information")
    fun checkLoginInformation(
        @RequestBody params: LoginInformationInputDto
    ): ResponseEntity<LoginInformationResponseDto?> {
        return ResponseMessenger.buildResponse { service.checkLoginInformation(params) }
    }
}