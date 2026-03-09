package br.com.synergia.utilsEntities.services

import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class EntityDeleteByIdSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun deleteEventById(idEvent: Long) {
        val sql = SqlPath.EntityDeleteById.DELETE_EVENT_BY_ID.load()
        val paramMap = MapSqlParameterSource().addValue("id_event", idEvent, Types.BIGINT)
        template.update(sql, paramMap)
    }
    fun deleteProjectEventRelationshipByIdEvent(idEvent: Long) {
        val sql = SqlPath.EntityDeleteById.DELETE_PROJECT_EVENT_RELATIONSHIP_BY_ID_EVENT.load()
        val paramMap = MapSqlParameterSource().addValue("id_event", idEvent, Types.BIGINT)
        template.update(sql, paramMap)
    }
    fun deleteProjectEventRelationshipByIdProject(idProject: Long) {
        val sql = SqlPath.EntityDeleteById.DELETE_PROJECT_EVENT_RELATIONSHIP_BY_ID_PROJECT.load()
        val paramMap = MapSqlParameterSource().addValue("id_project", idProject, Types.BIGINT)
        template.update(sql, paramMap)
    }
    fun deleteProjectById(idProject: Long) {
        val sql = SqlPath.EntityDeleteById.DELETE_PROJECT_BY_ID.load()
        val paramMap = MapSqlParameterSource().addValue("id_project", idProject, Types.BIGINT)
        template.update(sql, paramMap)
    }
    fun deleteAccountById(idAccount: Long) {
        val sql = SqlPath.EntityDeleteById.DELETE_ACCOUNT_BY_ID.load()
        val paramMap = MapSqlParameterSource().addValue("id_account", idAccount, Types.BIGINT)
        template.update(sql, paramMap)
    }

}