package com.example.synergia.repositories.pageCreateEvento

import com.example.synergia.rest.pageCreateEvento.dto.input.UpdateEventoDto
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class UpdateEventoSql (
    override val params: UpdateEventoDto
) : ISqlUpdateStatement<UpdateEventoDto> {
    override val sql: String = """
        UPDATE event e SET
            title = :title, 
            description = :description
        WHERE e.id = :id
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
        paramMap.addValue("id", params.id, Types.BIGINT)
        paramMap.addValue("title", params.title, Types.VARCHAR)
        paramMap.addValue("description", params.description, Types.VARCHAR)
    }
}