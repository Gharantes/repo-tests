package br.com.synergia.config.limite

import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Component
import java.time.Duration

/**
 * Proteções contra força bruta de senha (robôs). Nas duas, só as tentativas que
 * FALHAM contam: quem acerta a senha de primeira nunca é afetado.
 *
 * Ficam em memória, como o [LimitadorDeTaxa]: zeram quando o backend reinicia.
 * O IP vem de `request.remoteAddr` (ver `server.forward-headers-strategy` no
 * application.yaml). Valor 0 em qualquer limite desliga aquele limite.
 */

/** Resposta 429 com `Retry-After` e a mensagem no `x-error`, que o frontend mostra. */
fun <T : Any> respostaBarrada(barrado: LimitadorDeTaxa.Resultado.Barrado, mensagem: String): ResponseEntity<T> {
    val segundos = barrado.tenteDeNovoEm.toSeconds()
    return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
        .header(HttpHeaders.RETRY_AFTER, segundos.toString())
        .header("x-error", "$mensagem Tente de novo em ${minutosDeEspera(barrado.tenteDeNovoEm)} minuto(s).")
        .build()
}

fun minutosDeEspera(espera: Duration): Long = (espera.toSeconds() + 59) / 60

/**
 * Login (`/api/page-login/check-login-information`):
 *
 * - por conta: depois de `falhas-por-conta` senhas erradas para o mesmo login da
 *   mesma instituição, aquele login fica travado até a janela passar, inclusive
 *   para a senha certa. É isso que impede o robô de acertar no chute N+1.
 * - por IP: no máximo `falhas-por-ip` falhas, somando todos os logins. Pega o robô
 *   que testa uma senha comum em muitas contas.
 *
 * A trava é pelo texto do login, exista a conta ou não, e a resposta é a mesma
 * nos dois casos: travar não revela quais logins existem.
 *
 * Efeito colateral conhecido: alguém que erra de propósito trava o login de outra
 * pessoa por até `janela-minutos`. É o preço de impedir a força bruta sem captcha.
 */
@Component
class ProtecaoLogin(
    @Value("\${synergia.limite-login.falhas-por-conta:5}") falhasPorConta: Int,
    @Value("\${synergia.limite-login.falhas-por-ip:30}") falhasPorIp: Int,
    @Value("\${synergia.limite-login.janela-minutos:15}") janelaMinutos: Long,
) {
    private val porConta = LimitadorDeTaxa(falhasPorConta, Duration.ofMinutes(janelaMinutos))
    private val porIp = LimitadorDeTaxa(falhasPorIp, Duration.ofMinutes(janelaMinutos))

    /** Se esta tentativa nem deve ser avaliada, a resposta 429 a devolver. */
    fun <T : Any> barrar(ip: String, idTenant: Long?, login: String?): ResponseEntity<T>? {
        val barrado = listOf(porConta.verificar(chave(idTenant, login)), porIp.verificar(ip))
            .filterIsInstance<LimitadorDeTaxa.Resultado.Barrado>()
            .maxByOrNull { it.tenteDeNovoEm }
            ?: return null
        return respostaBarrada(barrado, "Muitas tentativas de login sem sucesso.")
    }

    fun registrarFalha(ip: String, idTenant: Long?, login: String?) {
        porConta.registrar(chave(idTenant, login))
        porIp.registrar(ip)
    }

    /** O dono acertou: as falhas anteriores daquele login não contam mais. */
    fun registrarSucesso(idTenant: Long?, login: String?) {
        porConta.zerar(chave(idTenant, login))
    }

    private fun chave(idTenant: Long?, login: String?) = "$idTenant:${login?.trim()?.lowercase()}"
}

/**
 * Senha da página de instituições (`check-list-tenants-password` e `delete`, que
 * usa a mesma senha): no máximo `falhas-por-ip` senhas erradas por IP na janela.
 */
@Component
class ProtecaoSenhaInstituicoes(
    @Value("\${synergia.limite-senha-instituicoes.falhas-por-ip:5}") falhasPorIp: Int,
    @Value("\${synergia.limite-senha-instituicoes.janela-minutos:15}") janelaMinutos: Long,
) {
    private val porIp = LimitadorDeTaxa(falhasPorIp, Duration.ofMinutes(janelaMinutos))

    fun <T : Any> barrar(ip: String): ResponseEntity<T>? {
        val resultado = porIp.verificar(ip) as? LimitadorDeTaxa.Resultado.Barrado ?: return null
        return respostaBarrada(resultado, "Muitas senhas erradas.")
    }

    fun registrarFalha(ip: String) = porIp.registrar(ip)

    fun registrarSucesso(ip: String) = porIp.zerar(ip)
}
