package br.com.synergia.unit

import br.com.synergia.config.senha.Senhas
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import io.kotest.matchers.string.shouldNotContain
import io.kotest.matchers.string.shouldStartWith

/**
 * Testes de unidade do hash de senhas.
 *
 * A suíte de segurança (tests/security/02-criptografia-senhas.test.mjs) olha o
 * que ficou gravado no banco depois de cada caminho da API; aqui fica a regra:
 * bcrypt com sal, conferência certa, e o formato antigo (texto puro) aceito só
 * para não trancar ninguém fora.
 */
class SenhasTest : FunSpec({

    val senhas = Senhas()

    test("o hash é bcrypt e não contém a senha") {
        val hash = senhas.gerarHash("Minha-Senha-Secreta-1!")

        hash shouldStartWith "\$2a\$${Senhas.CUSTO}\$"
        hash shouldNotContain "Minha-Senha-Secreta-1!"
        senhas.ehHash(hash) shouldBe true
    }

    test("a mesma senha gera hashes diferentes (sal), e os dois conferem") {
        val a = senhas.gerarHash("Senha-Repetida-123!")
        val b = senhas.gerarHash("Senha-Repetida-123!")

        a shouldNotBe b
        senhas.confere("Senha-Repetida-123!", a) shouldBe true
        senhas.confere("Senha-Repetida-123!", b) shouldBe true
    }

    test("senha errada, vazia ou nula não confere") {
        val hash = senhas.gerarHash("certa")

        senhas.confere("errada", hash) shouldBe false
        senhas.confere("", hash) shouldBe false
        senhas.confere(null, hash) shouldBe false
    }

    test("conta inexistente (sem senha gravada) nunca confere") {
        senhas.confere("qualquer", null) shouldBe false
    }

    test("formato antigo: texto puro confere e é marcado para virar hash") {
        senhas.confere("SenhaAntiga123", "SenhaAntiga123") shouldBe true
        senhas.confere("outra", "SenhaAntiga123") shouldBe false
        senhas.precisaDeHashNovo("SenhaAntiga123") shouldBe true
        senhas.precisaDeHashNovo(senhas.gerarHash("x")) shouldBe false
    }

    test("um texto que só parece hash não é tratado como hash") {
        senhas.ehHash("\$2a\$10\$curto") shouldBe false
        senhas.ehHash("") shouldBe false
        senhas.ehHash(null) shouldBe false
    }
})
