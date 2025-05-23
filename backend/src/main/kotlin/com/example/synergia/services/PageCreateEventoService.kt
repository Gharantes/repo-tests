package com.example.synergia.services

import com.example.synergia.repositories.pageCreateEvento.CreateEventoSql
import com.example.synergia.rest.pageCreateEvento.dto.input.CreateEventoDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageCreateEventoService (
    private val template: JdbcTemplate
) {
    fun createEvento(params: CreateEventoDto) {
        CreateEventoSql(params).executeStatement(template)
    }
}