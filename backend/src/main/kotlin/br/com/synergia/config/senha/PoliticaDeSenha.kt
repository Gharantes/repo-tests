package br.com.synergia.config.senha

import java.nio.charset.StandardCharsets

/**
 * Regras mínimas para uma senha nova (cadastro de conta, troca de senha e ADMIN
 * da instituição). Recusa senhas como "123", "abc" ou "senha", que caem no
 * primeiro minuto de uma força bruta ou de uma lista de senhas vazadas.
 *
 * - pelo menos [MINIMO] caracteres;
 * - pelo menos uma letra e um número;
 * - no máximo [MAXIMO_BYTES] bytes, que é até onde o bcrypt olha: o que passasse
 *   disso seria ignorado sem ninguém saber.
 */
object PoliticaDeSenha {
    const val MINIMO = 8
    const val MAXIMO_BYTES = 72

    /** O motivo pelo qual [senha] não serve, ou null se ela serve. */
    fun problema(senha: String): String? = when {
        senha.length < MINIMO -> "A senha precisa ter pelo menos $MINIMO caracteres."
        senha.none { it.isLetter() } || senha.none { it.isDigit() } -> "A senha precisa ter letras e números."
        senha.toByteArray(StandardCharsets.UTF_8).size > MAXIMO_BYTES -> "A senha pode ter no máximo $MAXIMO_BYTES bytes."
        else -> null
    }

    /** Lança uma exceção com a mensagem para o usuário (vira o `x-error` da resposta). */
    fun exigir(senha: String) {
        problema(senha)?.let { throw IllegalArgumentException(it) }
    }
}
