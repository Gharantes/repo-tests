package br.com.synergia.unit

import br.com.synergia.config.limite.LimitadorDeTaxa
import br.com.synergia.config.limite.ProtecaoLogin
import br.com.synergia.config.limite.ProtecaoSenhaInstituicoes
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.string.shouldContain
import java.time.Duration

/**
 * Testes de unidade das proteções contra força bruta de senha.
 *
 * A suíte de segurança (tests/security/04-bots.test.mjs) confere o comportamento
 * contra o backend rodando; aqui ficam as regras: só falha conta, a trava vale até
 * para a senha certa, acertar zera, e a trava não revela se o login existe.
 */
class ProtecaoForcaBrutaTest : FunSpec({

    val ip = "203.0.113.7"

    context("LimitadorDeTaxa: verificar e registrar separados") {
        test("verificar não conta tentativa; registrar conta") {
            val limitador = LimitadorDeTaxa(2, Duration.ofMinutes(15))

            repeat(10) { limitador.verificar("k") shouldBe LimitadorDeTaxa.Resultado.Permitido }
            limitador.registrar("k")
            limitador.registrar("k")
            (limitador.verificar("k") is LimitadorDeTaxa.Resultado.Barrado) shouldBe true
        }

        test("zerar libera a chave na hora") {
            val limitador = LimitadorDeTaxa(1, Duration.ofMinutes(15))

            limitador.registrar("k")
            limitador.zerar("k")
            limitador.verificar("k") shouldBe LimitadorDeTaxa.Resultado.Permitido
        }
    }

    context("ProtecaoLogin") {
        test("trava o login depois de N senhas erradas, inclusive para a senha certa") {
            val protecao = ProtecaoLogin(falhasPorConta = 5, falhasPorIp = 100, janelaMinutos = 15)

            repeat(5) {
                protecao.barrar<Any>(ip, 1L, "maria").shouldBeNull()
                protecao.registrarFalha(ip, 1L, "maria")
            }

            val barrada = protecao.barrar<Any>(ip, 1L, "maria").shouldNotBeNull()
            barrada.statusCode.value() shouldBe 429
            barrada.headers.getFirst("Retry-After").shouldNotBeNull()
            barrada.headers.getFirst("x-error")!! shouldContain "Muitas tentativas de login"
        }

        test("acertar a senha antes de travar zera as falhas daquele login") {
            val protecao = ProtecaoLogin(falhasPorConta = 3, falhasPorIp = 100, janelaMinutos = 15)

            repeat(2) { protecao.registrarFalha(ip, 1L, "maria") }
            protecao.registrarSucesso(1L, "maria")
            repeat(2) { protecao.registrarFalha(ip, 1L, "maria") }

            protecao.barrar<Any>(ip, 1L, "maria").shouldBeNull()
        }

        test("a trava é por instituição + login, sem diferenciar maiúsculas") {
            val protecao = ProtecaoLogin(falhasPorConta = 1, falhasPorIp = 100, janelaMinutos = 15)

            protecao.registrarFalha(ip, 1L, "Maria")

            protecao.barrar<Any>(ip, 1L, " maria ").shouldNotBeNull()
            protecao.barrar<Any>(ip, 2L, "maria").shouldBeNull()
            protecao.barrar<Any>(ip, 1L, "joao").shouldBeNull()
        }

        test("login inexistente trava igual a um existente: a trava não revela quem existe") {
            val protecao = ProtecaoLogin(falhasPorConta = 2, falhasPorIp = 100, janelaMinutos = 15)

            repeat(2) {
                protecao.registrarFalha(ip, 1L, "maria")
                protecao.registrarFalha(ip, 1L, "nao-existe-ninguem")
            }

            val existente = protecao.barrar<Any>(ip, 1L, "maria").shouldNotBeNull()
            val inexistente = protecao.barrar<Any>(ip, 1L, "nao-existe-ninguem").shouldNotBeNull()
            existente.statusCode shouldBe inexistente.statusCode
            existente.headers.getFirst("x-error") shouldBe inexistente.headers.getFirst("x-error")
        }

        test("o limite por IP barra o robô que tenta uma senha em muitas contas") {
            val protecao = ProtecaoLogin(falhasPorConta = 5, falhasPorIp = 3, janelaMinutos = 15)

            listOf("ana", "bia", "caio").forEach { protecao.registrarFalha(ip, 1L, it) }

            protecao.barrar<Any>(ip, 1L, "duda").shouldNotBeNull()
            protecao.barrar<Any>("198.51.100.1", 1L, "duda").shouldBeNull()
        }

        test("limites em zero desligam a proteção") {
            val protecao = ProtecaoLogin(falhasPorConta = 0, falhasPorIp = 0, janelaMinutos = 15)

            repeat(50) { protecao.registrarFalha(ip, 1L, "maria") }
            protecao.barrar<Any>(ip, 1L, "maria").shouldBeNull()
        }
    }

    context("ProtecaoSenhaInstituicoes") {
        test("barra o IP depois de N senhas erradas e acertar libera") {
            val protecao = ProtecaoSenhaInstituicoes(falhasPorIp = 5, janelaMinutos = 15)

            repeat(5) { protecao.registrarFalha(ip) }
            protecao.barrar<Boolean>(ip).shouldNotBeNull().statusCode.value() shouldBe 429
            protecao.barrar<Boolean>("198.51.100.1").shouldBeNull()

            protecao.registrarSucesso(ip)
            protecao.barrar<Boolean>(ip).shouldBeNull()
        }
    }
})
