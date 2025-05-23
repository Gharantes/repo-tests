package com.example.synergia.repositories.pageCreateUsuario

import com.example.synergia.rest.pageCreateUsuario.dto.input.CreateUsuarioDto
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class CreateAccountSql (
    override val params: CreateUsuarioDto
) : ISqlUpdateStatement<CreateUsuarioDto> {
    override val sql: String = """
        INSERT INTO account (id_tenant, login, password) values (:id_tenant, :login, :password);
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        require(params.login.isNotBlank()) {
            "Login não pode estar vazio."
        }
        require(params.password.isNotBlank()) {
            "Senha não pode estar vazia."
        }
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
        paramMap.addValue("login", params.login, Types.VARCHAR)
        paramMap.addValue("password", params.password, Types.VARCHAR)
    }
}