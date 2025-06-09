package com.example.synergia.repositories.pageCreateProjeto

import com.example.synergia.rest.pageCreateProjeto.dto.input.CreateProjetoDto
import com.example.synergia.rest.pageCreateTenant.dto.input.CreateTenantDto
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class CreateProjetoSql (
    override val params: CreateProjetoDto,
    private val idBanner: Long?
) : ISqlUpdateStatement<CreateProjetoDto> {
    override val sql: String = """
        INSERT INTO project (
            id_tenant, 
            title, 
            created_by,
            description,
            id_banner
        ) values (
            :id_tenant, 
            :title, 
            :created_by,
            :description,
            :id_banner
        );
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
        paramMap.addValue("title", params.title, Types.VARCHAR)
        paramMap.addValue("description", params.description, Types.VARCHAR)
        paramMap.addValue("id_banner", idBanner, Types.BIGINT)
        paramMap.addValue("created_by", params.idAccount, Types.BIGINT)
    }
}