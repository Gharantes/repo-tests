package br.com.synergia.entityProject

import br.com.synergia.utilsCommons.extensions.parseStringToWildCard
import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class EntityProjectSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listProjectsByTenant(
        idTenant: Long,
        text: String?
    ): List<ProjectDto> {
        val sql = SqlPath.EntityProject.LIST_PROJECTS_BY_TENANT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.projectRowMapper)
    }

    fun listProjectsByAccount(idAccount: Long, text: String?): List<ProjectDto> {
        val sql = SqlPath.EntityProject.LIST_PROJECTS_BY_ACCOUNT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_account", idAccount, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.projectRowMapper)
    }

}