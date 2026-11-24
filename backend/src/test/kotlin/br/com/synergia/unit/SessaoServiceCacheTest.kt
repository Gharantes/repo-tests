package br.com.synergia.unit

import br.com.synergia.config.autenticacao.SessaoService
import br.com.synergia.config.autenticacao.UsuarioLogado
import br.com.synergia.libs.utilsEntities.jpa.sessao.Sessao
import br.com.synergia.libs.utilsEntities.jpa.sessao.SessaoRepository
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.shouldBe
import java.lang.reflect.Proxy
import java.time.LocalDateTime

/**
 * O cache de sessão existe porque o banco (plano gratuito do Render) é lento e a
 * sessão é validada em toda rota protegida. Este teste conta as idas ao banco: a
 * primeira validação consulta, as seguintes (dentro do minuto do cache) não.
 */
class SessaoServiceCacheTest : FunSpec({

    /** Repositório falso que guarda as sessões num mapa e conta as consultas. */
    class RepositorioFalso {
        val sessoes = mutableMapOf<String, Sessao>()
        var consultas = 0

        val proxy: SessaoRepository = Proxy.newProxyInstance(
            SessaoRepository::class.java.classLoader, arrayOf(SessaoRepository::class.java),
        ) { _, metodo, args ->
            when (metodo.name) {
                "save" -> (args[0] as Sessao).also { sessoes[it.tokenHash] = it }
                "findValida" -> { consultas++; sessoes[args[0] as String] }
                "deleteByTokenHash" -> { sessoes.remove(args[0] as String); 1 }
                "deleteByIdAccount" -> { sessoes.values.removeIf { it.idAccount == args[0] as Long }; 1 }
                "apagarExpiradas" -> 0
                "delete" -> { sessoes.remove((args[0] as Sessao).tokenHash); null }
                "hashCode" -> 0
                "equals" -> false
                "toString" -> "RepositorioFalso"
                else -> error("não usado no teste: ${metodo.name}")
            }
        } as SessaoRepository
    }

    test("validar várias vezes seguidas vai ao banco uma vez só") {
        val repo = RepositorioFalso()
        val sessoes = SessaoService(repo.proxy, duracaoHoras = 168)
        val token = sessoes.abrir(idAccount = 7, idTenant = 3)

        repeat(20) { sessoes.validar(token) shouldBe UsuarioLogado(7, 3) }

        repo.consultas shouldBe 1
    }

    test("logout derruba a sessão na hora, mesmo com ela no cache") {
        val repo = RepositorioFalso()
        val sessoes = SessaoService(repo.proxy, duracaoHoras = 168)
        val token = sessoes.abrir(7, 3)
        sessoes.validar(token)

        sessoes.encerrar(token)

        sessoes.validar(token).shouldBeNull()
    }

    test("apagar a conta derruba as sessões dela na hora, mesmo com elas no cache") {
        val repo = RepositorioFalso()
        val sessoes = SessaoService(repo.proxy, duracaoHoras = 168)
        val daAna = sessoes.abrir(7, 3)
        val doBruno = sessoes.abrir(8, 3)
        sessoes.validar(daAna)
        sessoes.validar(doBruno)

        sessoes.encerrarDaConta(7)

        sessoes.validar(daAna).shouldBeNull()
        sessoes.validar(doBruno) shouldBe UsuarioLogado(8, 3)
    }

    test("sessão vencida é recusada e apagada") {
        val repo = RepositorioFalso()
        val sessoes = SessaoService(repo.proxy, duracaoHoras = 168)
        val token = sessoes.abrir(7, 3)
        repo.sessoes.values.single().expiraEm = LocalDateTime.now().minusMinutes(1)

        sessoes.validar(token).shouldBeNull()
        repo.sessoes.isEmpty() shouldBe true
    }

    test("token desconhecido ou vazio não autentica") {
        val sessoes = SessaoService(RepositorioFalso().proxy, duracaoHoras = 168)

        sessoes.validar("nao-existe").shouldBeNull()
        sessoes.validar("").shouldBeNull()
        sessoes.validar(null).shouldBeNull()
    }
})
