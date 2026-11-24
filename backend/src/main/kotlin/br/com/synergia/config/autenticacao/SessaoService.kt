package br.com.synergia.config.autenticacao

import br.com.synergia.libs.utilsEntities.jpa.sessao.Sessao
import br.com.synergia.libs.utilsEntities.jpa.sessao.SessaoRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import java.security.MessageDigest
import java.security.SecureRandom
import java.time.Duration
import java.time.LocalDateTime
import java.util.Base64
import java.util.concurrent.ConcurrentHashMap

/** Quem está chamando a API: a conta e a instituição da sessão. */
data class UsuarioLogado(val idAccount: Long, val idTenant: Long)

/**
 * Sessões de login: o login com senha abre uma e devolve um token aleatório; o
 * frontend manda esse token em `Authorization: Bearer ...`, e o backend descobre
 * quem está chamando sem confiar em nenhum id que venha da requisição.
 *
 * A sessão vale por `synergia.sessao.duracao-horas` desde o último uso, e cai no
 * logout ou quando a conta/instituição é apagada.
 *
 * Desempenho: validar a sessão acontece em toda rota protegida, e o banco (plano
 * gratuito do Render) é lento. Por isso:
 * - o resultado fica num cache em memória por [CACHE]: cliques seguidos não vão ao
 *   banco para autenticar;
 * - quando vai, é uma consulta só (sessão + conferência da conta juntas);
 * - o vencimento só é empurrado no banco quando o cache renova, no máximo uma
 *   escrita por minuto por sessão.
 * O cache é por instância; o Synergia roda numa instância só.
 */
@Service
class SessaoService(
    private val repository: SessaoRepository,
    @Value("\${synergia.sessao.duracao-horas:168}") duracaoHoras: Long,
) {
    private val duracao = Duration.ofHours(duracaoHoras)
    private val aleatorio = SecureRandom()

    private class Entrada(val usuario: UsuarioLogado, val validaAte: Long)
    private val cache = ConcurrentHashMap<String, Entrada>()

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
        val chave = hash(token)
        val agora = System.currentTimeMillis()

        cache[chave]?.let { if (it.validaAte > agora) return it.usuario }

        // Uma consulta: a sessão só volta se a conta ainda existir na mesma instituição.
        val sessao = repository.findValida(chave)
        if (sessao == null) {
            cache.remove(chave)
            return null
        }
        val agoraData = LocalDateTime.now()
        if (sessao.expiraEm.isBefore(agoraData)) {
            repository.delete(sessao)
            cache.remove(chave)
            return null
        }
        // Cada ida ao banco empurra o vencimento; como o cache segura as próximas
        // requisições por um minuto, isso é no máximo uma escrita por minuto.
        sessao.expiraEm = agoraData.plus(duracao)
        repository.save(sessao)

        val usuario = UsuarioLogado(sessao.idAccount, sessao.idTenant)
        if (cache.size > MAXIMO_NO_CACHE) cache.clear()
        cache[chave] = Entrada(usuario, agora + CACHE.toMillis())
        return usuario
    }

    fun encerrar(token: String?) {
        if (token.isNullOrBlank()) return
        val chave = hash(token)
        cache.remove(chave)
        repository.deleteByTokenHash(chave)
    }

    /** A conta foi apagada: as sessões dela deixam de valer na hora, inclusive no cache. */
    fun encerrarDaConta(idAccount: Long) {
        cache.entries.removeIf { it.value.usuario.idAccount == idAccount }
        repository.deleteByIdAccount(idAccount)
    }

    /** A instituição foi apagada (o SQL de exclusão já apaga as linhas): limpa o cache. */
    fun esquecerDaInstituicao(idTenant: Long) {
        cache.entries.removeIf { it.value.usuario.idTenant == idTenant }
    }

    fun apagarExpiradas(): Int = repository.apagarExpiradas(LocalDateTime.now())

    private fun hash(token: String): String =
        MessageDigest.getInstance("SHA-256").digest(token.toByteArray()).joinToString("") { "%02x".format(it) }

    companion object {
        val CACHE: Duration = Duration.ofSeconds(60)
        private const val MAXIMO_NO_CACHE = 10_000
    }
}
