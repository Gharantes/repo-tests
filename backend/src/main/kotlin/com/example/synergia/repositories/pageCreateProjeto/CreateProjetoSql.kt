package com.example.synergia.repositories.pageCreateProjeto

import com.example.synergia.rest.pageCreateProjeto.dto.input.CreateProjetoDto
import com.example.synergia.rest.pageCreateTenant.dto.input.CreateTenantDto
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class CreateProjetoSql (
    override val params: CreateProjetoDto
) : ISqlUpdateStatement<CreateProjetoDto> {
    override val sql: String = """
        INSERT INTO project (
            id_tenant, 
            title, 
            description
        ) values (:id_tenant, :title, :description);
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        require(params.idTenant > 0L) {
            "Tenant Inválido"
        }
        require(params.title.isNotBlank()) {
            "Titúlo não pode estar vazio."
        }
        require(params.description.isNotBlank()) {
            "Identifier não pod estar vazio."
        }
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
        paramMap.addValue("title", params.title, Types.VARCHAR)
        paramMap.addValue("description", params.description, Types.VARCHAR)
    }
}