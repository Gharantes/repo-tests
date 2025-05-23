package com.example.synergia.repositories.pageListarProjetos

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class DeletarProjetoSql (
    override val params: Long
) : ISqlUpdateStatement<Long> {
    override val sql: String = """
        DELETE FROM project_event_relationship WHERE id_project = :id;
        DELETE FROM project p WHERE p.id = :id;
    """
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id", params, Types.BIGINT)
    }
}