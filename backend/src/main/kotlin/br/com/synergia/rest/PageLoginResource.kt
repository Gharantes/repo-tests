package br.com.synergia.rest

import br.com.synergia.config.limite.ProtecaoLogin
import br.com.synergia.libs.pageLogin.models.LoginInformationInputDto
import br.com.synergia.libs.pageLogin.models.LoginInformationResponseDto
import br.com.synergia.libs.pageLogin.services.PageLoginService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/page-login")
class PageLoginResource (
    private val service: PageLoginService,
    private val protecao: ProtecaoLogin,
) {
    @PostMapping("/check-login-information")
    fun checkLoginInformation(
        @RequestBody params: LoginInformationInputDto,
        request: HttpServletRequest,
    ): ResponseEntity<LoginInformationResponseDto> {
        val ip = request.remoteAddr ?: "desconhecido"
        protecao.barrar<LoginInformationResponseDto>(ip, params.idTenant, params.login)?.let { return it }

        val resposta = ResponseMessenger.buildResponse { service.checkLoginInformation(params) }

        if (resposta.statusCode.is2xxSuccessful && resposta.body != null) {
            protecao.registrarSucesso(params.idTenant, params.login)
        } else {
            protecao.registrarFalha(ip, params.idTenant, params.login)
        }
        return resposta
    }
}
