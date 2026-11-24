package br.com.synergia.config.senha

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Component
import java.nio.charset.StandardCharsets
import java.security.MessageDigest

/**
 * Hash e conferência de senhas de conta.
 *
 * A senha nunca é gravada como foi digitada: vira um hash bcrypt, que é lento de
 * propósito (custo [CUSTO]) e leva um sal aleatório, então duas contas com a mesma
 * senha ficam com valores diferentes no banco e um vazamento da tabela não entrega
 * as senhas.
 *
 * Contas antigas, de antes do hash, ainda podem ter a senha em texto puro: a
 * [MigracaoSenhasTextoPuro] converte todas quando o backend sobe, e [confere]
 * aceita o formato antigo só para não trancar fora quem foi gravado direto no banco
 * depois disso. Quem passa por esse caminho tem a senha convertida no login
 * (ver [precisaDeHashNovo]).
 */
@Component
class Senhas {
    private val encoder = BCryptPasswordEncoder(CUSTO)

    // Hash de uma senha qualquer, usado quando o login não existe: conferir contra
    // ele gasta o mesmo tempo que uma conta de verdade, e o tempo de resposta não
    // entrega quais logins existem.
    private val hashDeReferencia: String = encoder.encode("senha-de-referencia-para-tempo-constante")!!

    fun gerarHash(senha: String): String = encoder.encode(senha)!!

    fun ehHash(valor: String?): Boolean = valor != null && BCRYPT.matches(valor)

    /** A [senha] digitada bate com a [gravada] no banco? [gravada] nula = conta inexistente. */
    fun confere(senha: String?, gravada: String?): Boolean {
        if (senha.isNullOrEmpty()) return false
        if (gravada == null) {
            encoder.matches(senha, hashDeReferencia)
            return false
        }
        if (ehHash(gravada)) return encoder.matches(senha, gravada)
        // Formato antigo (texto puro). Comparação em tempo constante.
        return MessageDigest.isEqual(senha.toByteArray(StandardCharsets.UTF_8), gravada.toByteArray(StandardCharsets.UTF_8))
    }

    /** A senha gravada ainda está no formato antigo e deve ser trocada por um hash. */
    fun precisaDeHashNovo(gravada: String): Boolean = !ehHash(gravada)

    companion object {
        const val CUSTO = 10
        private val BCRYPT = Regex("""^\$2[aby]\$\d{2}\$[./A-Za-z0-9]{53}$""")
    }
}
