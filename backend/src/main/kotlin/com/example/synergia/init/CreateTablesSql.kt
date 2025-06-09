package com.example.synergia.init

import com.example.synergia.utils.interfaces.ISqlUpdateStatement
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate

class CreateTablesSql : ISqlUpdateStatement<Unit> {
    override val params = Unit
    override fun setParams(paramMap: MapSqlParameterSource) {}

    val list = listOf(
        createTenantSql(),
        createAttachmentsSql(),
        createAccountSql(),
        createEventSql(),
        createProjectSql(),
        createPersonSql(),
        createProjectEventRelationshipSql(),
        createTagsSql(),
        createEventMembersSql(),
        createProjectMembersSql()
    )
    override val sql: String = ""
    override fun executeStatement(template: NamedParameterJdbcTemplate): Int {
        list.forEach {
            template.execute(it, MapSqlParameterSource(), {})
        }
        return 0
    }

    private fun createTenantSql() = """
        CREATE TABLE IF NOT EXISTS tenant (
            id serial4 primary key,
            title varchar(255) not null,
            identifier varchar(255) not null
        )
    """.trimIndent()

    private fun createAttachmentsSql() = """
        create table IF NOT EXISTS attachments (
            id serial4 primary key,
            id_tenant bigint references tenant not null,
            url text not null,
            attachment_type integer not null
        )
    """.trimIndent()

    private fun createAccountSql() = """
        CREATE TABLE IF NOT EXISTS account (
            id serial4 primary key,
            id_tenant bigint references tenant,
            login varchar(255) not null,
            password varchar(255) not null,
            last_seen timestamp,
            created_at timestamp default now(),
            updated_at timestamp default now(),
        )
    """.trimIndent()

    private fun createEventSql() = """
        CREATE TABLE IF NOT EXISTS event (
            id serial4 primary key,
            id_tenant bigint references tenant not null,
            created_by bigint references account not null,
            id_banner bigint references attachments,
            title varchar(255) not null,
            description TEXT not null,
        )
    """.trimIndent()

    private fun createProjectSql() = """
        CREATE TABLE IF NOT EXISTS project (
            id serial4 primary key ,
            id_tenant bigint references tenant not null,
            title varchar(255) not null,
            description text not null
        )
    """.trimIndent()

    private fun createPersonSql() = """
        CREATE TABLE IF NOT EXISTS person (
            id serial4 primary key ,
            id_tenant bigint REFERENCES tenant not null ,
            id_account bigint references account,
            first_name varchar(255) not null ,
            last_name varchar(255) not null
        )
    """.trimIndent()

    private fun createProjectEventRelationshipSql() = """
        CREATE TABLE IF NOT EXISTS project_event_relationship (
            id_project bigint references project not null,
            id_event bigint references event not null
        )
    """.trimIndent()

    private fun createTagsSql() = """
        create table IF NOT EXISTS tags (
        	id serial4 primary key,
        	id_tenant bigint references tenant not null,
        	name varchar(255) not null,
        	created_at timestamp not null default now()
        )
    """.trimIndent()

    private fun createEventMembersSql() = """
        create table event_members (
            id_event bigint references event,
            id_account bigint references account
        );
    """.trimIndent()

    private fun createProjectMembersSql() = """
        create table project_members (
            id_project bigint references project,
            id_account bigint references account
        );
    """.trimIndent()


}