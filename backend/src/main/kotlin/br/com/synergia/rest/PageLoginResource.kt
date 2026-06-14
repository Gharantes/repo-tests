package br.com.synergia.rest

import br.com.synergia.libs.pageLogin.models.LoginInformationInputDto
import br.com.synergia.libs.pageLogin.models.LoginInformationResponseDto
import br.com.synergia.libs.pageLogin.services.PageLoginService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/page-login")
class PageLoginResource (
    private val service: PageLoginService
) {
    @PostMapping("/check-login-information")
    fun checkLoginInformation(
        @RequestBody params: LoginInformationInputDto
    ): ResponseEntity<LoginInformationResponseDto?> {
        return ResponseMessenger.buildResponse { service.checkLoginInformation(params) }
    }
}