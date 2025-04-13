package com.example.synergia.services

import com.example.synergia.repositories.pageCreateProjeto.CreateProjetoSql
import com.example.synergia.rest.pageCreateProjeto.dto.input.CreateProjetoDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageCreateProjetoService (
    private val template: JdbcTemplate
) {
    fun createProjeto(params: CreateProjetoDto) {
        CreateProjetoSql(params).executeStatement(template)
    }
}