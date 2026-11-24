package br.com.synergia.libs.pageLogin.services

import br.com.synergia.config.senha.Senhas
import br.com.synergia.libs.pageLogin.models.LoginInformationInputDto
import br.com.synergia.libs.pageLogin.models.LoginInformationResponseDto
import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
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
    private val senhas: Senhas,
) {
    private class ContaEncontrada(
        val dto: LoginInformationResponseDto,
        val senhaGravada: String,
        val vistoRecentemente: Boolean,
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
                vistoRecentemente = rs.getBoolean("visto_recentemente"),
            )
        }.firstOrNull()

        // Modo "continuar logado": não confere senha, só se a conta foi vista há
        // pouco. Comportamento de antes, mantido como estava.
        if (params.checkLastSeen) {
            return conta?.takeIf { it.vistoRecentemente }?.dto
        }

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
    fun updateLastSeen(idAccount: Long) {
        accountRepository.findById(idAccount).ifPresent { account ->
            account.lastSeen = LocalDateTime.now()
            accountRepository.save(account)
        }
    }
}
