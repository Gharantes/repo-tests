package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.postJson
import br.com.synergia.libs.pageLogin.models.LoginInformationInputDto
import br.com.synergia.libs.pageLogin.models.LoginInformationResponseDto
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import br.com.synergia.config.senha.MigracaoSenhasTextoPuro
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.DefaultApplicationArguments
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import java.time.LocalDateTime

/**
 * Integração da autenticação (RF02 / RF03).
 *
 * Cobre `POST /api/page-login/check-login-information` de ponta a ponta: HTTP
 * real -> controller real -> `check-login-information.sql` real -> PostgreSQL
 * real. É o tipo de coisa que teste de unidade não pega, porque o que decide o
 * resultado é o `INNER JOIN` com `tenant` no SQL e a conferência do hash bcrypt.
 */
@DisplayName("Integração: página de login")
class PageLoginIntegrationTest : IntegrationTestBase() {

    private val url = "/api/page-login/check-login-information"

    @Autowired
    private lateinit var migracaoSenhas: MigracaoSenhasTextoPuro

    @Test
    fun `credenciais corretas devolvem os dados da conta e do tenant`() {
        val idTenant = criarTenant(identifier = "fag", title = "FAG")
        val idConta = criarConta(
            idTenant = idTenant,
            login = "gharantes",
            senha = "SenhaCorreta123",
            primeiroNome = "Guilherme",
            sobrenome = "Arantes",
        )

        val resposta = rest.postJson<LoginInformationResponseDto>(
            url,
            LoginInformationInputDto(idTenant, "gharantes", "SenhaCorreta123", checkLastSeen = false),
        )

        resposta.statusCode shouldBe HttpStatus.OK
        val corpo = resposta.body.shouldNotBeNull()
        corpo.idAccount shouldBe idConta
        corpo.idTenant shouldBe idTenant
        corpo.login shouldBe "gharantes"
        corpo.firstName shouldBe "Guilherme"
        corpo.lastName shouldBe "Arantes"
        // Veio do JOIN com tenant, não da tabela account.
        corpo.tenantTitle shouldBe "FAG"
    }

    @Test
    fun `senha errada não autentica`() {
        val idTenant = criarTenant()
        criarConta(idTenant, login = "gharantes", senha = "SenhaCorreta123")

        val resposta = rest.postJson<LoginInformationResponseDto>(
            url,
            LoginInformationInputDto(idTenant, "gharantes", "SenhaErrada", checkLastSeen = false),
        )

        resposta.statusCode shouldBe HttpStatus.OK
        resposta.body shouldBe null
    }

    @Test
    fun `login inexistente não autentica`() {
        val idTenant = criarTenant()
        criarConta(idTenant, login = "gharantes", senha = "SenhaCorreta123")

        val resposta = rest.postJson<LoginInformationResponseDto>(
            url,
            LoginInformationInputDto(idTenant, "naoexiste", "SenhaCorreta123", checkLastSeen = false),
        )

        resposta.body shouldBe null
    }

    @Test
    fun `a senha certa no tenant errado não autentica`() {
        // Isolamento entre instituições: mesmo login e mesma senha, tenant diferente.
        val idFag = criarTenant(identifier = "fag", title = "FAG")
        val idOutra = criarTenant(identifier = "outra", title = "Outra Faculdade")
        criarConta(idFag, login = "gharantes", senha = "SenhaCorreta123")

        val resposta = rest.postJson<LoginInformationResponseDto>(
            url,
            LoginInformationInputDto(idOutra, "gharantes", "SenhaCorreta123", checkLastSeen = false),
        )

        resposta.body shouldBe null
    }

    @Test
    fun `autenticar atualiza o last_seen da conta no banco`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "gharantes", senha = "SenhaCorreta123")

        // Joga o last_seen para trás para que a diferença seja visível.
        jdbc.update("UPDATE account SET last_seen = ? WHERE id = ?", LocalDateTime.now().minusDays(3), idConta)
        val antes = jdbc.queryForObject(
            "SELECT last_seen FROM account WHERE id = ?", LocalDateTime::class.java, idConta,
        )!!

        rest.postJson<LoginInformationResponseDto>(
            url,
            LoginInformationInputDto(idTenant, "gharantes", "SenhaCorreta123", checkLastSeen = false),
        )

        val depois = jdbc.queryForObject(
            "SELECT last_seen FROM account WHERE id = ?", LocalDateTime::class.java, idConta,
        )!!
        depois shouldNotBe antes
        (depois.isAfter(antes)) shouldBe true
    }

    @Test
    fun `sessao recente é aceita quando checkLastSeen está ligado, mesmo sem senha`() {
        // Este é o modo "continuar logado": o SQL ignora a senha e olha se o
        // last_seen tem menos de 12 horas.
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "gharantes", senha = "SenhaCorreta123")
        jdbc.update("UPDATE account SET last_seen = ? WHERE id = ?", LocalDateTime.now().minusHours(1), idConta)

        val resposta = rest.postJson<LoginInformationResponseDto>(
            url,
            LoginInformationInputDto(idTenant, "gharantes", "senha-irrelevante", checkLastSeen = true),
        )

        resposta.body.shouldNotBeNull().idAccount shouldBe idConta
    }

    @Test
    fun `sessao vencida é recusada quando checkLastSeen está ligado`() {
        val idTenant = criarTenant()
        val idConta = criarConta(idTenant, login = "gharantes", senha = "SenhaCorreta123")
        // 13 horas: passou da janela de 12 horas escrita no SQL.
        jdbc.update("UPDATE account SET last_seen = ? WHERE id = ?", LocalDateTime.now().minusHours(13), idConta)

        val resposta = rest.postJson<LoginInformationResponseDto>(
            url,
            LoginInformationInputDto(idTenant, "gharantes", "SenhaCorreta123", checkLastSeen = true),
        )

        resposta.body shouldBe null
    }

    @Test
    fun `conta antiga com senha em texto puro entra e a senha vira hash no login`() {
        // Contas de antes do hash. A migração da subida converte todas; esta foi
        // gravada direto no banco depois dela, como faria um script manual.
        val idTenant = criarTenant(identifier = "fag", title = "FAG")
        val idConta = criarConta(idTenant, login = "antiga", senha = "qualquer")
        jdbc.update("UPDATE account SET password = 'SenhaAntiga123' WHERE id = ?", idConta)

        val resposta = rest.postJson<LoginInformationResponseDto>(
            url,
            LoginInformationInputDto(idTenant, "antiga", "SenhaAntiga123", checkLastSeen = false),
        )

        resposta.body.shouldNotBeNull().idAccount shouldBe idConta
        val gravada = jdbc.queryForObject("SELECT password FROM account WHERE id = ?", String::class.java, idConta)!!
        gravada shouldNotBe "SenhaAntiga123"
        BCryptPasswordEncoder().matches("SenhaAntiga123", gravada) shouldBe true
    }

    @Test
    fun `a migração da subida converte as senhas em texto puro e o dono continua entrando`() {
        val idTenant = criarTenant(identifier = "fag", title = "FAG")
        val idConta = criarConta(idTenant, login = "antiga", senha = "qualquer")
        jdbc.update("UPDATE account SET password = 'SenhaAntiga123' WHERE id = ?", idConta)

        migracaoSenhas.run(DefaultApplicationArguments())

        val gravada = jdbc.queryForObject("SELECT password FROM account WHERE id = ?", String::class.java, idConta)!!
        BCryptPasswordEncoder().matches("SenhaAntiga123", gravada) shouldBe true
        rest.postJson<LoginInformationResponseDto>(
            url,
            LoginInformationInputDto(idTenant, "antiga", "SenhaAntiga123", checkLastSeen = false),
        ).body.shouldNotBeNull().idAccount shouldBe idConta
    }
}
