package com.example.synergia.services

import com.example.synergia.repositories.pageCreateProjeto.CreateProjetoSql
import com.example.synergia.repositories.pageCreateProjeto.GetCreateProjetoDtoByIdSql
import com.example.synergia.rest.pageCreateProjeto.dto.input.CreateProjetoDto
import com.example.synergia.rest.pageCreateProjeto.dto.input.UpdateProjetoDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageCreateProjetoService (
    private val template: JdbcTemplate
) {
    fun getCreateProjetoDtoById(id: Long): CreateProjetoDto? =
        GetCreateProjetoDtoByIdSql(id).queryForObject(template)

    fun createProjeto(params: CreateProjetoDto) {
        val idProjeto = CreateProjetoSql(params)
            .executeStatementWithReturnKey(template, "id")
            ?.toLong()

        requireNotNull(idProjeto) { "Erro ao criar projeto." }

//        if (params.eventosSelecionados.isNotEmpty()) {
//            CreateProjetoEventoRelationship(
//                params,
//                idProjeto
//            ).executeStatement(template)
//        }
    }

    fun updateProjeto(params: UpdateProjetoDto) {
        println(params)
    }
}