package com.example.synergia.utils.interfaces

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.jdbc.support.KeyHolder

interface ISqlUpdateStatement <Params> : ISql {
    val params: Params
    fun setParams(paramMap: MapSqlParameterSource): Unit

    /** Returns the number of rows affected by the update **/
    fun executeStatement (template: JdbcTemplate): Int =
        executeStatement(NamedParameterJdbcTemplate(template))
    /** Returns the number of rows affected by the update **/
    fun executeStatement (template: NamedParameterJdbcTemplate): Int {
        return template.update(
            getSqlStatement(),
            MapSqlParameterSource().apply { setParams(this) }
        )
    }
    /** Returns the requested column as string **/
    fun executeStatementWithReturnKey (
        template: JdbcTemplate,
        key: String
    ): String? =
        executeStatementWithReturnKey(
            NamedParameterJdbcTemplate(template),
            key
        )
    /** Returns the requested column as string **/
    fun executeStatementWithReturnKey (
        template: NamedParameterJdbcTemplate,
        key: String
    ): String? {
        val keyHolder: KeyHolder = GeneratedKeyHolder()
        template.update(
            getSqlStatement(),
            MapSqlParameterSource().apply { setParams(this) },
            keyHolder,
            listOf(key).toTypedArray()
        )
        return keyHolder.keys?.get(key)?.toString()
    }
}