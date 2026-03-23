package br.com.synergia.actionAttributePermissions.services

import br.com.synergia.actionAttributePermissions.models.AttributePermissionsDto
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class ActionAttributePermissionsSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun attributePermissions(params: AttributePermissionsDto) {
        val sql = SqlPath.ActionAttributePermissions.ATTRIBUTE_PERMISSIONS.load()
            .replace(":ID_ACCOUNTS", params.idAccounts.joinToString(","))
            .replace(":ID_PERMISSIONS", params.idPermissions.joinToString(","))
        val paramMap = MapSqlParameterSource()
        template.update(sql, paramMap)
    }
}