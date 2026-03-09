package br.com.synergia.utilsEntities.services

import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.models.TenantDto
import br.com.synergia.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types


@Service
class EntityGetByIdSqlService (private val template: NamedParameterJdbcTemplate) {

    fun getEventById(idEvent: Long): EventDto? {
        val sql = SqlPath.EntityGetById.GET_EVENT_BY_ID.load()
        val paramMap = MapSqlParameterSource().addValue("id_event", idEvent, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.eventRowMapper).firstOrNull()
    }
    fun getTenantById(idTenant: Long): TenantDto? {
        val sql = SqlPath.EntityGetById.GET_TENANT_BY_ID.load()
        val paramMap = MapSqlParameterSource().addValue("id_tenant", idTenant, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.tenantRowMapper).firstOrNull()
    }
    fun getProjectById(idProject: Long): ProjectDto? {
        val sql = SqlPath.EntityGetById.GET_PROJECT_BY_ID.load()
        val paramMap = MapSqlParameterSource().addValue("id_project", idProject, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.projectRowMapper).firstOrNull()
    }
}