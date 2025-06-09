package com.example.synergia.init

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource

class AlterTablesSql (
    override val sql: String
) : ISqlUpdateStatement<Unit> {
    override val params = Unit
    override fun setParams(paramMap: MapSqlParameterSource) {}

    companion object {
        fun tenantUniqueIdentifierSql() = AlterTablesSql("""
            ALTER TABLE tenant
            ADD CONSTRAINT tenant_unique_identifier UNIQUE (identifier);
        """.trimIndent())

        fun uniqueTagByTenantSql() = AlterTablesSql("""
            ALTER TABLE tags 
            ADD CONSTRAINT unique_tag_by_tenant UNIQUE (id_tenant, name);
        """.trimIndent())

        fun uniqueNameByTenantSql() = AlterTablesSql("""
            ALTER TABLE account 
            ADD CONSTRAINT unique_login_by_tenant UNIQUE (id_tenant, login);
        """.trimIndent())

        fun uniqueEventMembersSql() = AlterTablesSql("""
            alter table event_members 
            add constraint unique_event_members unique (id_event, id_account);
        """.trimIndent())

        fun uniqueProjectMembersSql() = AlterTablesSql("""
            alter table project_members 
            add constraint unique_project_members unique (id_project, id_account);
        """.trimIndent())

        fun projectAlterTableCreatedBy() = AlterTablesSql("""
            alter table project 
            add column created_by bigint references account not null;
        """.trimIndent())

        fun projectAlterTableIdBanner() = AlterTablesSql("""
            alter table project 
            add column id_banner bigint references attachments;
        """.trimIndent())
    }
}