package com.example.synergia.repositories.pageCreateProjeto

import com.example.synergia.rest.pageCreateProjeto.dto.input.CreateProjetoDto
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource

class CreateProjetoEventoRelationship (
    override val params: CreateProjetoDto,
    private val idProjeto: Long
) : ISqlUpdateStatement<CreateProjetoDto> {
    override val sql: String = """
        INSERT INTO project_event_relationship (
            id_tenant,
            id_project,
            id_event
        ) VALUES ${buildSql()}
    """.trimIndent()

    private fun buildSql(): String {
        return params.eventosSelecionados.joinToString(",") {
            "(${params.idTenant},$idProjeto,$it)"
        }
    }
    override fun setParams(paramMap: MapSqlParameterSource) {}
}