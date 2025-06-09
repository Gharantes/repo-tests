package com.example.synergia.repositories.attachments

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class UpdateAttachmentUrlSql (
    override val params: Long,
    private val url: String
) : ISqlUpdateStatement<Long> {
    override val sql: String = "UPDATE attachments SET url = :url WHERE id = :id"

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("url", url, Types.VARCHAR)
        paramMap.addValue("id", params, Types.BIGINT)
    }

}