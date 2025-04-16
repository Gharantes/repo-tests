package com.example.synergia.repositories.pageListarEventos

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class DeletarEventoSql (
    override val params: Long
) : ISqlUpdateStatement<Long> {
    override val sql: String = """
        DELETE FROM project_event_relationship per WHERE per.id_event = :id;
        DELETE FROM event e WHERE e.id = :id;
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id", params, Types.BIGINT)
    }
}