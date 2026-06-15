package br.com.synergia.libs.utilsCommons.extensions

import java.sql.ResultSet

fun ResultSet.getNullableLong(columnName: String) : Long? {
    return this.getLong(columnName).takeUnless { this.wasNull() }
}