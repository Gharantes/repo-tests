package com.example.synergia.utils.interfaces

interface ISql {
    val sql: String
    fun getSqlStatement(): String {
        if (sql.isBlank()) {
            throw RuntimeException("No SQL specified")
        }
        return sql
    }
}