package br.com.synergia.config.autenticacao

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.servlet.HandlerInterceptor
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

/**
 * Rotas que exigem login. Quem chama sem `Authorization: Bearer <token>` válido
 * recebe 401 antes de chegar no controller.
 *
 * Por enquanto a lista cobre as rotas que devolvem dados de contas (e-mail,
 * nome): elas eram as que vazavam para qualquer um. As outras rotas de dados
 * ainda estão abertas e entram aqui conforme forem corrigidas.
 *
 * Além do login, cada controller ainda confere se o dado pedido é da mesma
 * instituição da sessão (ver [usuarioLogado]): estar logado na instituição A não
 * dá acesso aos dados da instituição B.
 */
@Configuration
class AutenticacaoConfig(private val sessoes: SessaoService) : WebMvcConfigurer {

    override fun addInterceptors(registry: InterceptorRegistry) {
        registry.addInterceptor(AutenticacaoInterceptor(sessoes)).addPathPatterns(ROTAS_PROTEGIDAS)
    }

    companion object {
        val ROTAS_PROTEGIDAS = listOf(
            "/api/entity-account/list-accounts-by-tenant",
            "/api/entity-get-by-id/get-account-by-id/**",
            "/api/page-login/sessao-atual",
            "/api/page-login/logout",
        )
    }
}

private const val ATRIBUTO_USUARIO = "synergia.usuarioLogado"

/** O token do cabeçalho `Authorization: Bearer ...`, se houver. */
fun tokenDaRequisicao(request: HttpServletRequest): String? =
    request.getHeader(HttpHeaders.AUTHORIZATION)
        ?.takeIf { it.startsWith("Bearer ", ignoreCase = true) }
        ?.substring(7)
        ?.trim()
        ?.takeIf { it.isNotEmpty() }

/**
 * Quem fez login, numa rota que está em [AutenticacaoConfig.ROTAS_PROTEGIDAS].
 * Use este id, nunca o id-tenant/id-account que veio na requisição, para decidir
 * o que a pessoa pode ver.
 */
fun usuarioLogado(request: HttpServletRequest): UsuarioLogado =
    request.getAttribute(ATRIBUTO_USUARIO) as? UsuarioLogado
        ?: error("Rota sem autenticação: inclua o caminho em AutenticacaoConfig.ROTAS_PROTEGIDAS.")

class AutenticacaoInterceptor(private val sessoes: SessaoService) : HandlerInterceptor {

    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        // O preflight do CORS não leva o cabeçalho Authorization.
        if (request.method == "OPTIONS") return true

        val usuario = sessoes.validar(tokenDaRequisicao(request))
        if (usuario == null) {
            response.status = HttpStatus.UNAUTHORIZED.value()
            response.setHeader("x-error", "Sessão expirada ou inexistente. Faça login de novo.")
            return false
        }
        request.setAttribute(ATRIBUTO_USUARIO, usuario)
        return true
    }
}
