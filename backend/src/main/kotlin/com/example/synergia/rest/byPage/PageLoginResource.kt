package com.example.synergia.rest.byPage

import com.example.synergia.models.byPage.pageLogin.dto.input.LoginInformationInputDto
import com.example.synergia.models.byPage.pageLogin.dto.output.LoginInformationResponseDto
import com.example.synergia.models.byPage.pageLogin.dto.output.LoginTenantInformationDto
import com.example.synergia.services.byPage.PageLoginService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/login")
class PageLoginResource (
    private val service: PageLoginService
) {
    @GetMapping("/listar-tenants")
    fun listarTenantsLogin(): ResponseEntity<List<LoginTenantInformationDto>> =
        ResponseMessenger.buildResponse { service.listarTenantsLogin() }

    @PostMapping("/check-login-information")
    fun checkLoginInformation(
        @RequestBody params: LoginInformationInputDto
    ): ResponseEntity<LoginInformationResponseDto?> =
        ResponseMessenger.buildResponse { service.checkLoginInformation(params) }
}