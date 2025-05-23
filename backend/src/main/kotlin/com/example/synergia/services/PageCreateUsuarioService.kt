package com.example.synergia.services

import com.example.synergia.repositories.pageCreateUsuario.CreateAccountSql
import com.example.synergia.repositories.pageCreateUsuario.CreatePersonSql
import com.example.synergia.rest.pageCreateUsuario.dto.input.CreateUsuarioDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageCreateUsuarioService (
    private val template: JdbcTemplate
) {
    fun createUsuario(params: CreateUsuarioDto) {
        val idAccount = CreateAccountSql(params)
            .executeStatementWithReturnKey(template, "id")
            ?.toLong()
        CreatePersonSql(params, idAccount)

    }
}