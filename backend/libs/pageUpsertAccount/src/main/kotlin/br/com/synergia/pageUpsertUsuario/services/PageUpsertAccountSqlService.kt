package br.com.synergia.pageUpsertUsuario.services

import br.com.synergia.pageUpsertUsuario.models.UpsertAccountDto
import br.com.synergia.utilsEntities.models.AccountDto
import br.com.synergia.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageUpsertAccountSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun getAccountByLoginOrEmail(idTenant: Long, login: String, email: String): AccountDto? {
        val sql = SqlPath.PageUpsertAccount.GET_ACCOUNT_BY_LOGIN_OR_EMAIL.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("login", login, Types.VARCHAR)
            .addValue("email", email, Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.accountRowMapper).firstOrNull()
    }
    fun createAccount(params: UpsertAccountDto) {
        val sql = SqlPath.PageUpsertAccount.INSERT_ACCOUNT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
            .addValue("login", params.login, Types.VARCHAR)
            .addValue("email", params.email, Types.VARCHAR)
            .addValue("first_name", params.firstName, Types.VARCHAR)
            .addValue("last_name", params.lastName, Types.VARCHAR)
            .addValue("password", params.password, Types.VARCHAR)
        template.update(sql, paramMap)
    }
    fun updateAccount(params: UpsertAccountDto) {
        val sql = SqlPath.PageUpsertAccount.UPDATE_ACCOUNT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("login", params.login, Types.VARCHAR)
            .addValue("email", params.email, Types.VARCHAR)
            .addValue("password", params.password, Types.VARCHAR)
            .addValue("first_name", params.firstName, Types.VARCHAR)
            .addValue("last_name", params.lastName, Types.VARCHAR)
        template.update(sql, paramMap)
    }
}