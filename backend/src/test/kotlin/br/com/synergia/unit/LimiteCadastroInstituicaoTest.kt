package br.com.synergia.unit

import br.com.synergia.config.limite.LimitadorDeTaxa
import br.com.synergia.config.limite.LimiteInterceptor
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import io.kotest.matchers.types.shouldBeInstanceOf
import org.springframework.mock.web.MockHttpServletRequest
import org.springframework.mock.web.MockHttpServletResponse
import java.time.Duration

/**
 * Testes de unidade do limite de cadastro de instituições (anti-robô).
 *
 * Sem ele, um robô anônimo cria quantas instituições quiser pela
 * /api/entity-tenant/store, cada uma com um ADMIN. A suíte de segurança
 * (tests/security/04-bots.test.mjs) confere isso contra o backend rodando; aqui
 * fica a regra da janela, com um relógio falso para não precisar esperar.
 */
class LimiteCadastroInstituicaoTest : FunSpec({

    class Relogio(var ms: Long = 1_000_000L)

    context("LimitadorDeTaxa") {
        test("permite até o máximo dentro da janela e barra a seguinte") {
            val relogio = Relogio()
            val limitador = LimitadorDeTaxa(3, Duration.ofMinutes(60)) { relogio.ms }

            repeat(3) { limitador.tentar("1.2.3.4") shouldBe LimitadorDeTaxa.Resultado.Permitido }
            limitador.tentar("1.2.3.4").shouldBeInstanceOf<LimitadorDeTaxa.Resultado.Barrado>()
        }

        test("cada IP tem a própria conta") {
            val limitador = LimitadorDeTaxa(1, Duration.ofMinutes(60))

            limitador.tentar("1.1.1.1") shouldBe LimitadorDeTaxa.Resultado.Permitido
            limitador.tentar("2.2.2.2") shouldBe LimitadorDeTaxa.Resultado.Permitido
            limitador.tentar("1.1.1.1").shouldBeInstanceOf<LimitadorDeTaxa.Resultado.Barrado>()
        }

        test("libera de novo quando a tentativa mais antiga sai da janela") {
            val relogio = Relogio()
            val limitador = LimitadorDeTaxa(2, Duration.ofMinutes(60)) { relogio.ms }

            limitador.tentar("ip")
            relogio.ms += Duration.ofMinutes(30).toMillis()
            limitador.tentar("ip")

            val barrado = limitador.tentar("ip").shouldBeInstanceOf<LimitadorDeTaxa.Resultado.Barrado>()
            barrado.tenteDeNovoEm shouldBe Duration.ofMinutes(30)

            relogio.ms += Duration.ofMinutes(30).toMillis()
            limitador.tentar("ip") shouldBe LimitadorDeTaxa.Resultado.Permitido
        }

        test("tentativa barrada não conta: o robô que insiste não fica preso para sempre") {
            val relogio = Relogio()
            val limitador = LimitadorDeTaxa(1, Duration.ofMinutes(60)) { relogio.ms }

            limitador.tentar("ip")
            repeat(50) {
                relogio.ms += 1_000
                limitador.tentar("ip")
            }
            relogio.ms = 1_000_000L + Duration.ofMinutes(60).toMillis()
            limitador.tentar("ip") shouldBe LimitadorDeTaxa.Resultado.Permitido
        }

        test("máximo zero desliga o limite") {
            val limitador = LimitadorDeTaxa(0, Duration.ofMinutes(60))

            limitador.ligado shouldBe false
            repeat(100) { limitador.tentar("ip") shouldBe LimitadorDeTaxa.Resultado.Permitido }
        }
    }

    context("LimiteInterceptor") {
        fun post(ip: String) = MockHttpServletRequest("POST", "/api/entity-tenant/store").apply { remoteAddr = ip }

        test("deixa passar dentro do limite e responde 429 com Retry-After e x-error depois") {
            val interceptor = LimiteInterceptor(LimitadorDeTaxa(1, Duration.ofMinutes(60)))

            interceptor.preHandle(post("9.9.9.9"), MockHttpServletResponse(), Any()) shouldBe true

            val resposta = MockHttpServletResponse()
            interceptor.preHandle(post("9.9.9.9"), resposta, Any()) shouldBe false
            resposta.status shouldBe 429
            resposta.getHeader("Retry-After") shouldBe "3600"
            resposta.getHeader("x-error")!! shouldContain "Tente de novo em 60 minuto(s)"
        }

        test("só conta POST: o preflight OPTIONS do navegador não gasta tentativa") {
            val interceptor = LimiteInterceptor(LimitadorDeTaxa(1, Duration.ofMinutes(60)))
            val opcoes = MockHttpServletRequest("OPTIONS", "/api/entity-tenant/store").apply { remoteAddr = "8.8.8.8" }

            repeat(5) { interceptor.preHandle(opcoes, MockHttpServletResponse(), Any()) shouldBe true }
            interceptor.preHandle(post("8.8.8.8"), MockHttpServletResponse(), Any()) shouldBe true
        }
    }
})
