package br.com.synergia.unit

import br.com.synergia.config.senha.PoliticaDeSenha
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.string.shouldContain
import org.junit.jupiter.api.assertThrows

/**
 * A política mínima de senha nova. A suíte de segurança
 * (tests/security/02-criptografia-senhas.test.mjs) confere pela API que "123",
 * "abc" e "senha" são recusadas no cadastro; aqui ficam as regras.
 */
class PoliticaDeSenhaTest : FunSpec({

    test("recusa as senhas fracas da suíte de segurança") {
        listOf("123", "abc", "senha").forEach { PoliticaDeSenha.problema(it).shouldNotBeNull() }
    }

    test("exige pelo menos 8 caracteres") {
        PoliticaDeSenha.problema("Abc1234")!! shouldContain "8 caracteres"
        PoliticaDeSenha.problema("Abcd1234").shouldBeNull()
    }

    test("exige letras e números") {
        PoliticaDeSenha.problema("somenteletras")!! shouldContain "letras e números"
        PoliticaDeSenha.problema("1234567890")!! shouldContain "letras e números"
    }

    test("aceita senhas fortes, com acento e símbolo") {
        listOf("SenhaForte123", "Sinergia#Teste-2026!", "coração-azul-7").forEach {
            PoliticaDeSenha.problema(it).shouldBeNull()
        }
    }

    test("recusa o que passa dos 72 bytes que o bcrypt usa") {
        PoliticaDeSenha.problema("a1" + "x".repeat(71))!! shouldContain "72 bytes"
    }

    test("exigir lança a mensagem que vai para o usuário") {
        assertThrows<IllegalArgumentException> { PoliticaDeSenha.exigir("123") }.message!! shouldContain "8 caracteres"
    }
})
