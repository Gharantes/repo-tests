package com.example.synergia.repositories.pageCreateTenant

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class CreateAdminAccountSql (
    override val params: Long
) : ISqlUpdateStatement<Long> {
    override val sql: String = """
        INSERT INTO ACCOUNT (
            id_tenant,
            login,
            password
        ) values (:id_tenant, 'ADMIN', 'ADMIN');
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tenant", params, Types.BIGINT)
    }
}