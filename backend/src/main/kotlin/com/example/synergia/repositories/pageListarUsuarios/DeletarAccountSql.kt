package com.example.synergia.repositories.pageListarUsuarios

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class DeletarAccountSql (
    override val params: Long
) : ISqlUpdateStatement<Long> {
    override val sql: String = "DELETE FROM account a WHERE a.id = :id;"
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id", params, Types.BIGINT)
    }
}