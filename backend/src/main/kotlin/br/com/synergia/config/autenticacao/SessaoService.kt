package br.com.synergia.config.autenticacao

import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.sessao.Sessao
import br.com.synergia.libs.utilsEntities.jpa.sessao.SessaoRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Duration
import java.time.LocalDateTime
import java.util.Base64

/** Quem está chamando a API: a conta e a instituição da sessão. */
data class UsuarioLogado(val idAccount: Long, val idTenant: Long)

/**
 * Sessões de login: o login com senha abre uma e devolve um token aleatório; o
 * frontend manda esse token em `Authorization: Bearer ...`, e o backend descobre
 * quem está chamando sem confiar em nenhum id que venha da requisição.
 *
 * A sessão vale por `synergia.sessao.duracao-horas` desde o último uso (cada
 * requisição empurra o vencimento), e cai no logout.
 */
@Service
class SessaoService(
    private val repository: SessaoRepository,
    private val accountRepository: AccountRepository,
    @Value("\${synergia.sessao.duracao-horas:168}") duracaoHoras: Long,
) {
    private val duracao = Duration.ofHours(duracaoHoras)
    private val aleatorio = SecureRandom()

    /** Abre uma sessão para a conta e devolve o token, que só o cliente guarda. */
    fun abrir(idAccount: Long, idTenant: Long): String {
        // Aproveita o login para varrer as sessões vencidas: sem isso a tabela só cresce.
        apagarExpiradas()
        val bytes = ByteArray(32).also(aleatorio::nextBytes)
        val token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes)
        repository.save(
            Sessao(
                tokenHash = hash(token),
                idAccount = idAccount,
                idTenant = idTenant,
                expiraEm = LocalDateTime.now().plus(duracao),
            )
        )
        return token
    }

    /** Quem é o dono do [token], ou null se ele não existe, venceu ou a conta sumiu. */
    fun validar(token: String?): UsuarioLogado? {
        if (token.isNullOrBlank()) return null
        val sessao = repository.findByTokenHash(hash(token)) ?: return null
        val agora = LocalDateTime.now()
        if (sessao.expiraEm.isBefore(agora)) {
            repository.delete(sessao)
            return null
        }
        // Conta apagada (ou movida) não pode continuar usando a sessão antiga.
        val conta = accountRepository.findById(sessao.idAccount).orElse(null) ?: return null
        if (conta.idTenant != sessao.idTenant) return null

        // Renova o vencimento, mas no máximo uma vez por minuto, para não gravar a cada requisição.
        val novoVencimento = agora.plus(duracao)
        if (Duration.between(sessao.expiraEm, novoVencimento) > Duration.ofMinutes(1)) {
            sessao.expiraEm = novoVencimento
            repository.save(sessao)
        }
        return UsuarioLogado(sessao.idAccount, sessao.idTenant)
    }

    fun encerrar(token: String?) {
        if (!token.isNullOrBlank()) repository.deleteByTokenHash(hash(token))
    }

    fun apagarExpiradas(): Int = repository.apagarExpiradas(LocalDateTime.now())

    private fun hash(token: String): String =
        MessageDigest.getInstance("SHA-256").digest(token.toByteArray()).joinToString("") { "%02x".format(it) }
}
