package br.com.synergia.config.limite

import java.time.Duration
import java.util.ArrayDeque
import java.util.concurrent.ConcurrentHashMap

/**
 * Limite de taxa por chave (normalmente o IP de quem chama), com janela deslizante:
 * no máximo [maximo] tentativas dentro de qualquer intervalo de [janela].
 *
 * Fica em memória, então zera quando o backend reinicia, e cada instância conta
 * só o que passou por ela. Para o Synergia, que roda numa instância só, é o
 * suficiente para barrar um robô sem precisar de Redis.
 *
 * [maximo] menor ou igual a zero desliga o limite.
 */
class LimitadorDeTaxa(
    private val maximo: Int,
    private val janela: Duration,
    private val agora: () -> Long = System::currentTimeMillis,
) {
    sealed interface Resultado {
        data object Permitido : Resultado
        data class Barrado(val tenteDeNovoEm: Duration) : Resultado
    }

    val ligado: Boolean get() = maximo > 0

    private val tentativas = ConcurrentHashMap<String, ArrayDeque<Long>>()

    /** Registra uma tentativa de [chave] e diz se ela pode seguir. Tentativa barrada não conta. */
    fun tentar(chave: String): Resultado {
        if (!ligado) return Resultado.Permitido

        val agora = agora()
        val inicioDaJanela = agora - janela.toMillis()
        limparChavesAntigas(inicioDaJanela)

        val fila = tentativas.computeIfAbsent(chave) { ArrayDeque() }
        synchronized(fila) {
            while (fila.isNotEmpty() && fila.peekFirst() <= inicioDaJanela) fila.pollFirst()
            if (fila.size >= maximo) {
                // Libera quando a tentativa mais antiga sair da janela.
                val espera = fila.peekFirst() + janela.toMillis() - agora
                return Resultado.Barrado(Duration.ofMillis(espera.coerceAtLeast(1_000)))
            }
            fila.addLast(agora)
            return Resultado.Permitido
        }
    }

    /**
     * Sem isto, cada IP que passasse ficaria no mapa para sempre. A limpeza só roda
     * quando o mapa cresce, para não varrer tudo a cada requisição.
     */
    private fun limparChavesAntigas(inicioDaJanela: Long) {
        if (tentativas.size < LIMPAR_ACIMA_DE) return
        tentativas.entries.removeIf { (_, fila) ->
            synchronized(fila) { fila.isEmpty() || fila.peekLast() <= inicioDaJanela }
        }
    }

    private companion object {
        const val LIMPAR_ACIMA_DE = 1_000
    }
}
