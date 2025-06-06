package com.example.synergia.init

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import com.fasterxml.jackson.databind.util.Named
import org.postgresql.util.PSQLException
import org.springframework.jdbc.BadSqlGrammarException
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Component

@Component
class AppInitService (
    private val template: NamedParameterJdbcTemplate
) {
    fun init() {
        CreateTablesSql().executeStatement(template)
        exec(AlterTablesSql.tenantUniqueIdentifierSql())
        exec(AlterTablesSql.uniqueTagByTenantSql())
        exec(AlterTablesSql.uniqueNameByTenantSql())
    }
    fun exec(iSql: ISqlUpdateStatement<Unit>) {
        try {
            iSql.executeStatement(template)
        } catch (_: PSQLException) {
            println("Já existe")
        } catch (_: BadSqlGrammarException) {
            println("Já existe")
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}