package br.com.synergia.pageListAccounts.services

import br.com.synergia.utilsEntities.models.AccountDto
import br.com.synergia.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageListAccountsSqlService (
    private val template: NamedParameterJdbcTemplate,
) {
    fun listAccounts(idTenant: Long, text: String?): List<AccountDto> {
        val sql = SqlPath.PageListAccounts.LIST_ACCOUNTS.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("text", text, Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.accountRowMapper)
    }
}