package com.example.synergia.utils.interfaces

import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.RowMapper
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate

interface ISqlGetterStatement <Result, Params> : ISql {
    val params: Params
    val rowMapper: RowMapper<Result>
    fun setParams(paramMap: MapSqlParameterSource)

    fun query (template: JdbcTemplate): List<Result> =
        query(NamedParameterJdbcTemplate(template))
    fun query (template: NamedParameterJdbcTemplate): List<Result> {
        return template.query(
            getSqlStatement(),
            MapSqlParameterSource().apply { setParams(this) },
            rowMapper
        )
    }

    fun queryForObject (template: JdbcTemplate): Result? =
        queryForObject(NamedParameterJdbcTemplate(template))
    fun queryForObject (template: NamedParameterJdbcTemplate): Result? {
        return template.queryForObject(
            getSqlStatement(),
            MapSqlParameterSource().apply { setParams(this) },
            rowMapper
        )
    }
}