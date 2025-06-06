package com.example.synergia.init

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource

class AlterTablesSql (
    override val sql: String
) : ISqlUpdateStatement<Unit> {
    override val params = Unit
    override fun setParams(paramMap: MapSqlParameterSource) {}

    companion object {
        fun tenantUniqueIdentifierSql(): AlterTablesSql =
            AlterTablesSql("""
                ALTER TABLE tenant
                ADD CONSTRAINT tenant_unique_identifier UNIQUE (identifier);
            """.trimIndent())

        fun uniqueTagByTenantSql() = AlterTablesSql("""
            alter table tags 
            add constraint unique_tag_by_tenant unique (id_tenant, name);
        """.trimIndent())

        fun uniqueNameByTenantSql() = AlterTablesSql("""
            alter table account 
            add constraint unique_login_by_tenant unique (id_tenant, login);
        """.trimIndent())
    }
}