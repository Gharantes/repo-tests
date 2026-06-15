package br.com.synergia.libs.entityPermission.services

import br.com.synergia.libs.utilsEntities.models.PermissionDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class EntityPermissionSqlService (private val template: NamedParameterJdbcTemplate) {
    fun listPermissions(text: String?): List<PermissionDto> {
        val sql = SqlPath.PageListPermissions.LIST_PERMISSIONS.load()
        val paramMap = MapSqlParameterSource().addValue("text", text, Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.permissionRowMapper)
    }
}