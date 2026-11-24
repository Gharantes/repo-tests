package br.com.synergia.config.limite

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.web.servlet.HandlerInterceptor
import org.springframework.web.servlet.config.annotation.InterceptorRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer
import java.time.Duration

/**
 * Barra a criação de instituições em massa (robôs): cada IP pode criar no máximo
 * `synergia.limite-cadastro-instituicao.maximo` instituições a cada
 * `synergia.limite-cadastro-instituicao.janela-minutos` minutos. Passou disso, a
 * API responde 429 com `Retry-After`.
 *
 * É um interceptor do Spring MVC, e não um filtro de servlet, de propósito: o
 * interceptor roda depois do CORS, então o 429 sai com os cabeçalhos de CORS e o
 * navegador deixa o frontend ler a resposta e mostrar a mensagem.
 *
 * O IP vem de `request.remoteAddr`. Atrás do proxy do Render, ele só é o IP do
 * cliente porque `server.forward-headers-strategy: native` está ligado no
 * application.yaml.
 */
@Configuration
class LimiteCadastroInstituicaoConfig(
    @Value("\${synergia.limite-cadastro-instituicao.maximo:10}") maximo: Int,
    @Value("\${synergia.limite-cadastro-instituicao.janela-minutos:60}") janelaMinutos: Long,
) : WebMvcConfigurer {

    private val limitador = LimitadorDeTaxa(maximo, Duration.ofMinutes(janelaMinutos))

    override fun addInterceptors(registry: InterceptorRegistry) {
        if (limitador.ligado) {
            registry.addInterceptor(LimiteInterceptor(limitador)).addPathPatterns(CAMINHO)
        }
    }

    companion object {
        const val CAMINHO = "/api/entity-tenant/store"
    }
}

class LimiteInterceptor(private val limitador: LimitadorDeTaxa) : HandlerInterceptor {

    override fun preHandle(request: HttpServletRequest, response: HttpServletResponse, handler: Any): Boolean {
        if (request.method != "POST") return true

        return when (val resultado = limitador.tentar(request.remoteAddr ?: "desconhecido")) {
            LimitadorDeTaxa.Resultado.Permitido -> true
            is LimitadorDeTaxa.Resultado.Barrado -> {
                val segundos = resultado.tenteDeNovoEm.toSeconds()
                val minutos = (segundos + 59) / 60
                response.status = HttpStatus.TOO_MANY_REQUESTS.value()
                response.setHeader(HttpHeaders.RETRY_AFTER, segundos.toString())
                // Mesmo cabeçalho que o ResponseMessenger usa: o frontend mostra este texto.
                response.setHeader(
                    "x-error",
                    "Muitas instituições criadas a partir deste endereço. Tente de novo em $minutos minuto(s).",
                )
                false
            }
        }
    }
}
