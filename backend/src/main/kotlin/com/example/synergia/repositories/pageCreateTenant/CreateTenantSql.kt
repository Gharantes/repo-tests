package com.example.synergia.repositories.pageCreateTenant

import com.example.synergia.rest.pageCreateTenant.dto.input.CreateTenantDto
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class CreateTenantSql (
    override val params: CreateTenantDto
) : ISqlUpdateStatement<CreateTenantDto> {
    override val sql: String = """
        INSERT INTO tenant (title, identifier) values (:title, :identifier);
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        require(params.title.isNotBlank()) {
            "Titúlo não pode estar vazio."
        }
        require(params.identifier.isNotBlank()) {
            "Identifier não pod estar vazio."
        }
        paramMap.addValue("title", params.title, Types.VARCHAR)
        paramMap.addValue("identifier", params.identifier, Types.VARCHAR)
    }
}