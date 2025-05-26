package com.example.synergia.repositories.pageCreateEvento

import com.example.synergia.rest.pageCreateEvento.dto.input.CreateEventoDto
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class CreateEventoSql (
    override val params: CreateEventoDto,
    private val idBanner: Long?
) : ISqlUpdateStatement<CreateEventoDto> {
    override val sql: String = """
        INSERT INTO event (
            id_tenant, 
            title, 
            description,
            created_by,
            id_banner
        ) values (
            :id_tenant, 
            :title, 
            :description,
            :created_by,
            :id_banner
        );
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
        paramMap.addValue("created_by", params.createdByIdAccount, Types.BIGINT)
        paramMap.addValue("id_banner", idBanner, Types.BIGINT)
    }
}