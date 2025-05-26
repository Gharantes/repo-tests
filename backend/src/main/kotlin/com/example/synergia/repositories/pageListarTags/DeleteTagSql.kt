package com.example.synergia.repositories.pageListarTags

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class DeleteTagSql (
    override val params: Long
) : ISqlUpdateStatement<Long> {
    override val sql: String = """
        DELETE FROM tags WHERE id = :id_tag
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tag", params, Types.BIGINT)
    }
}