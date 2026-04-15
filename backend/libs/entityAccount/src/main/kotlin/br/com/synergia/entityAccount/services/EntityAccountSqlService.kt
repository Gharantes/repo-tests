package br.com.synergia.entityAccount.services

import br.com.synergia.entityAccount.models.UpsertAccountDto
import br.com.synergia.utilsEntities.jpa.account.Account
import br.com.synergia.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.utilsEntities.models.AccountDto
import br.com.synergia.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types
import java.time.LocalDateTime

@Service
class EntityAccountSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val accountRepository: AccountRepository
) {
    fun listAccountsByTenant(idTenant: Long, text: String?): List<AccountDto> {
        val sql = SqlPath.PageListAccounts.LIST_ACCOUNTS.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("text", text, Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.accountRowMapper)
    }
    fun getAccountByLoginOrEmail(idTenant: Long, login: String?, email: String?): AccountDto? {
        val sql = SqlPath.PageUpsertAccount.GET_ACCOUNT_BY_LOGIN_OR_EMAIL.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("login", login, Types.VARCHAR)
            .addValue("email", email, Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.accountRowMapper).firstOrNull()
    }
    fun createAccount(params: UpsertAccountDto) {
        val account = Account(idTenant = params.idTenant)
        account.login = params.login
        account.email = params.email
        account.firstName = params.firstName
        account.lastName = params.lastName
        account.password = params.password
        accountRepository.save(account)
    }
    fun updateAccount(idAccount: Long, params: UpsertAccountDto) {
        accountRepository.findById(idAccount).ifPresent { account ->
            account.password = params.password
            account.email = params.email
            account.firstName = params.firstName
            account.lastName = params.lastName
            account.login = params.login
            account.updatedAt = LocalDateTime.now()
            if (params.password.isNotBlank()) {
                account.password = params.password
            }
            accountRepository.save(account)
        }
    }
}