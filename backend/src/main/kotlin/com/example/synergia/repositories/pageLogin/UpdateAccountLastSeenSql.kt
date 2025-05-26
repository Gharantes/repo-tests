package com.example.synergia.repositories.pageLogin

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class UpdateAccountLastSeenSql (
    override val params: Long
) : ISqlUpdateStatement<Long> {
    override val sql: String = """
        UPDATE account SET last_seen = now() WHERE id = :id_account
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_account", params, Types.BIGINT)
    }
}