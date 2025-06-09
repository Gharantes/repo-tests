package com.example.synergia.repositories.attachments

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class DeleteAttachmentSql (
    override val params: Long
) : ISqlUpdateStatement<Long> {
    override val sql: String = "DELETE FROM attachment WHERE id = :id;"
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id", params, Types.BIGINT)
    }
}