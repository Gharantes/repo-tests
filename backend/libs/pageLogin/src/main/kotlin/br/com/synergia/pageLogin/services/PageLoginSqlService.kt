package br.com.synergia.pageLogin.services

import br.com.synergia.pageLogin.models.LoginInformationInputDto
import br.com.synergia.pageLogin.models.LoginInformationResponseDto
import br.com.synergia.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.utilsEntities.jpa.tenant.TenantRepository
import br.com.synergia.utilsEntities.jpa.tenant.toDto
import br.com.synergia.utilsEntities.models.TenantDto
import br.com.synergia.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types
import java.time.LocalDateTime

@Service
class PageLoginSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val accountRepository: AccountRepository
) {

    fun checkLoginInformation(
        params: LoginInformationInputDto
    ): LoginInformationResponseDto? {
        val sql = SqlPath.PageLogin.CHECK_LOGIN_INFORMATION.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
            .addValue("login", params.login, Types.VARCHAR)
            .addValue("password", params.password, Types.VARCHAR)
            .addValue("check_last_seen", params.checkLastSeen, Types.BOOLEAN)
        return template.query(sql, paramMap) { rs, _ ->
            LoginInformationResponseDto(
                idAccount = rs.getLong("id"),
                login = rs.getString("login"),
                idTenant = rs.getLong("id_tenant"),
                tenantTitle = rs.getString("tenant_title"),
                firstName = rs.getString("first_name"),
                lastName = rs.getString("last_name"),
            )
        }.firstOrNull()
    }
    fun updateLastSeen(idAccount: Long) {
        accountRepository.findById(idAccount).ifPresent { account ->
            account.lastSeen = LocalDateTime.now()
            accountRepository.save(account)
        }
    }
}