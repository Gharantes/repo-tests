package com.example.synergia.repositories.pageListarTags

import com.example.synergia.rest.pageListarTags.dto.input.InsertTagDto
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import com.example.synergia.utils.models.generics.GenericIdTextDto
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class InsertTagSql (
    override val params: InsertTagDto
) : ISqlUpdateStatement<InsertTagDto> {
    override val sql: String = """
        insert into tags (id_tenant, name) values (:id_tenant, :name);
    """.trimIndent()
    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
            .addValue("name", params.name, Types.VARCHAR)
    }
}