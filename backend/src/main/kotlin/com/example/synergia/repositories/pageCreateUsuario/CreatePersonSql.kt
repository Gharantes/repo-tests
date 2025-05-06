package com.example.synergia.repositories.pageCreateUsuario

import com.example.synergia.rest.pageCreateUsuario.dto.input.CreateUsuarioDto
import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import java.sql.Types

class CreatePersonSql (
    override val params: CreateUsuarioDto,
    private val idAccount: Long?
) : ISqlUpdateStatement<CreateUsuarioDto> {
    override val sql: String = """
        INSERT INTO person (
            id_tenant, 
            first_name, 
            last_name,
            id_account
        ) values (:id_tenant, :first_name, :last_name, :id_account);
    """.trimIndent()

    override fun setParams(paramMap: MapSqlParameterSource) {
        paramMap.addValue("id_tenant", params.idTenant, Types.BIGINT)
        paramMap.addValue("first_name", params.firstName, Types.VARCHAR)
        paramMap.addValue("last_name", params.lastName, Types.VARCHAR)
        paramMap.addValue("id_account", idAccount, Types.BIGINT)
    }
}