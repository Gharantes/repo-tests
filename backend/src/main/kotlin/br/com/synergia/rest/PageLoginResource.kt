package br.com.synergia.rest

import br.com.synergia.config.autenticacao.SessaoService
import br.com.synergia.config.autenticacao.tokenDaRequisicao
import br.com.synergia.config.autenticacao.usuarioLogado
import br.com.synergia.config.limite.ProtecaoLogin
import br.com.synergia.libs.pageLogin.models.LoginInformationInputDto
import br.com.synergia.libs.pageLogin.models.LoginInformationResponseDto
import br.com.synergia.libs.pageLogin.services.PageLoginService
import br.com.synergia.libs.pageLogin.services.PageLoginSqlService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/page-login")
class PageLoginResource (
    private val service: PageLoginService,
    private val sqlService: PageLoginSqlService,
    private val protecao: ProtecaoLogin,
    private val sessoes: SessaoService,
) {
    /** Login com senha. Se der certo, abre uma sessão e devolve o token junto com a conta. */
    @PostMapping("/check-login-information")
    fun checkLoginInformation(
        @RequestBody params: LoginInformationInputDto,
        request: HttpServletRequest,
    ): ResponseEntity<LoginInformationResponseDto> {
        val ip = request.remoteAddr ?: "desconhecido"
        protecao.barrar<LoginInformationResponseDto>(ip, params.idTenant, params.login)?.let { return it }

        val resposta = ResponseMessenger.buildResponse { service.checkLoginInformation(params) }
        val conta = resposta.body

        if (!resposta.statusCode.is2xxSuccessful || conta == null) {
            protecao.registrarFalha(ip, params.idTenant, params.login)
            return resposta
        }
        protecao.registrarSucesso(params.idTenant, params.login)
        val token = sessoes.abrir(conta.idAccount, conta.idTenant)
        return ResponseEntity.ok(conta.copy(token = token))
    }

    /**
     * A conta da sessão do token enviado. É como o frontend restaura o login ao
     * recarregar a página, sem pedir a senha de novo e sem atalho que pule a senha.
     * Sem token válido, o interceptor de autenticação responde 401 antes daqui.
     */
    @PostMapping("/sessao-atual")
    fun sessaoAtual(request: HttpServletRequest): ResponseEntity<LoginInformationResponseDto> {
        val conta = sqlService.dadosDaConta(usuarioLogado(request).idAccount)
            ?: return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build()
        return ResponseEntity.ok(conta.copy(token = tokenDaRequisicao(request)))
    }

    /** Encerra a sessão do token enviado: ele deixa de valer na hora. */
    @PostMapping("/logout")
    fun logout(request: HttpServletRequest): ResponseEntity<Void> {
        sessoes.encerrar(tokenDaRequisicao(request))
        return ResponseEntity.ok().build()
    }
}
