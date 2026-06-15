package br.com.synergia.libs.entityAccount.services

import br.com.synergia.libs.entityAccount.models.UpsertAccountDto
import br.com.synergia.libs.utilsCommons.extensions.parseStringToWildCard
import br.com.synergia.libs.utilsEntities.jpa.account.Account
import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.accountTagRelationship.AccountTagRelationship
import br.com.synergia.libs.utilsEntities.jpa.accountTagRelationship.AccountTagRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.AccountDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types
import java.time.LocalDateTime

@Service
class EntityAccountSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val accountRepository: AccountRepository,
    private val accountTagRelationshipRepository: AccountTagRelationshipRepository
) {
    fun listAccountsByTenant(idTenant: Long, text: String?, tagIds: List<Long>? = null): List<AccountDto> {
        var sql = SqlPath.PageListAccounts.LIST_ACCOUNTS.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        if (!tagIds.isNullOrEmpty()) {
            sql += """
 AND a.id IN (
    SELECT atr.id_account
    FROM account_tag_relationship atr
    WHERE atr.id_tag IN (:tag_ids)
    GROUP BY atr.id_account
    HAVING COUNT(DISTINCT atr.id_tag) = :tag_count
)"""
            paramMap.addValue("tag_ids", tagIds)
            paramMap.addValue("tag_count", tagIds.size, Types.INTEGER)
        }
        return template.query(sql, paramMap, EntityRowMapper.accountRowMapper)
    }
    fun listAccountsByEvent(idEvent: Long, text: String?): List<AccountDto> {
        val sql = SqlPath.EntityAccount.LIST_ACCOUNTS_BY_EVENT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_event", idEvent, Types.BIGINT)
            .addValue("text", text, Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.accountRowMapper)
    }

    fun listAccountsByProject(idProject: Long, text: String?): List<AccountDto> {
        val sql = SqlPath.EntityAccount.LIST_ACCOUNTS_BY_PROJECT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_project", idProject, Types.BIGINT)
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
    fun createAccount(params: UpsertAccountDto): Long {
        val account = Account(idTenant = params.idTenant)
        account.login = params.login
        account.email = params.email
        account.firstName = params.firstName
        account.lastName = params.lastName
        account.password = params.password!!
        return accountRepository.save(account).id!!
    }

    fun createAccountTagRelationship(idAccount: Long, tags: List<Long>) {
        accountTagRelationshipRepository.saveAll(
            tags.map { AccountTagRelationship(idAccount = idAccount, idTag = it) }
        )
    }

    fun deleteAccountTagRelationships(idAccount: Long) {
        accountTagRelationshipRepository.deleteAllByIdAccount(idAccount)
    }
    fun updateAccount(idAccount: Long, params: UpsertAccountDto) {
        accountRepository.findById(idAccount).ifPresent { account ->
            account.email = params.email
            account.firstName = params.firstName
            account.lastName = params.lastName
            account.login = params.login
            account.updatedAt = LocalDateTime.now()

            if (!params.password.isNullOrBlank()) {
                account.password = params.password
            }
            accountRepository.save(account)
        }
    }
}