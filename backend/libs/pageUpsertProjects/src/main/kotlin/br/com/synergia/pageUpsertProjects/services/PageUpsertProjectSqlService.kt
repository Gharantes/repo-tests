package br.com.synergia.pageUpsertProjects.services

import br.com.synergia.pageUpsertProjects.models.UpsertProjectDto
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageUpsertProjectSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun createProject(params: UpsertProjectDto) {
        val sql = SqlPath.PageUpsertProject.INSERT_PROJECT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
            .addValue("description", params.title, Types.VARCHAR)
            .addValue("id_account_owner", params.idAccount, Types.BIGINT)
        template.update(sql, paramMap)
    }

    fun updateProject(idProject: Long, params: UpsertProjectDto) {
        val sql = SqlPath.PageUpsertProject.UPDATE_PROJECT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_project", idProject, Types.BIGINT)
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("description", params.description, Types.VARCHAR)
        template.update(sql, paramMap)
    }
}