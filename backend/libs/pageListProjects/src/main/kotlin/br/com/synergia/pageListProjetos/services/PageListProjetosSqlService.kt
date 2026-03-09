package br.com.synergia.pageListProjetos.services

import br.com.synergia.utilsCommons.extensions.parseStringToWildCard
import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageListProjetosSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listProjects(
        idTenant: Long,
        text: String?
    ): List<ProjectDto> {
        val sql = SqlPath.PageListProjects.LIST_PROJECTS.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.projectRowMapper)
    }

}