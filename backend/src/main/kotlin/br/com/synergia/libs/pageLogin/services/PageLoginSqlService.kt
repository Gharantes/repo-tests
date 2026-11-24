package br.com.synergia.libs.pageLogin.services

import br.com.synergia.config.senha.Senhas
import br.com.synergia.libs.pageLogin.models.LoginInformationInputDto
import br.com.synergia.libs.pageLogin.models.LoginInformationResponseDto
import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.tenant.TenantRepository
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types
import java.time.LocalDateTime

@Service
class PageLoginSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val accountRepository: AccountRepository,
    private val tenantRepository: TenantRepository,
    private val senhas: Senhas,
) {
    private class ContaEncontrada(
        val dto: LoginInformationResponseDto,
        val senhaGravada: String,
    )

    fun checkLoginInformation(
        params: LoginInformationInputDto
    ): LoginInformationResponseDto? {
        val sql = SqlPath.PageLogin.CHECK_LOGIN_INFORMATION.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
            .addValue("login", params.login, Types.VARCHAR)
        val conta = template.query(sql, paramMap) { rs, _ ->
            ContaEncontrada(
                dto = LoginInformationResponseDto(
                    idAccount = rs.getLong("id"),
                    login = rs.getString("login"),
                    idTenant = rs.getLong("id_tenant"),
                    tenantTitle = rs.getString("tenant_title"),
                    firstName = rs.getString("first_name"),
                    lastName = rs.getString("last_name"),
                ),
                senhaGravada = rs.getString("password"),
            )
        }.firstOrNull()

        // O antigo modo "continuar logado" (checkLastSeen) entrava sem senha em
        // qualquer conta vista nas últimas 12 horas. Agora a sessão é restaurada
        // pelo token (POST /api/page-login/sessao-atual), e o login sempre exige a
        // senha: o campo checkLastSeen é ignorado.
        //
        // Confere mesmo quando a conta não existe, para o tempo de resposta não
        // entregar quais logins existem.
        if (!senhas.confere(params.password, conta?.senhaGravada)) return null
        conta!!

        // Conta de antes do hash: aproveita a senha certa para gravar o hash.
        if (senhas.precisaDeHashNovo(conta.senhaGravada)) {
            accountRepository.findById(conta.dto.idAccount).ifPresent { account ->
                account.password = senhas.gerarHash(params.password)
                accountRepository.save(account)
            }
        }
        return conta.dto
    }
    /** Os mesmos dados do login, para a conta de uma sessão já aberta. */
    fun dadosDaConta(idAccount: Long): LoginInformationResponseDto? {
        val account = accountRepository.findById(idAccount).orElse(null) ?: return null
        val tenant = tenantRepository.findById(account.idTenant).orElse(null) ?: return null
        return LoginInformationResponseDto(
            idAccount = account.id!!,
            idTenant = tenant.id!!,
            login = account.login,
            tenantTitle = tenant.title,
            firstName = account.firstName,
            lastName = account.lastName,
        )
    }
    fun updateLastSeen(idAccount: Long) {
        accountRepository.findById(idAccount).ifPresent { account ->
            account.lastSeen = LocalDateTime.now()
            accountRepository.save(account)
        }
    }
}
