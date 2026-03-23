package br.com.synergia.actionManageRelationships.services

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class ActionManageRelationshipsSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun createRelationshipEventAndProject(
        idEvent: Long,
        idProject: Long,
    ) {

    }
    fun removeRelationshipEventAndProject(
        idEvent: Long,
        idProject: Long,
    ) {

    }
    fun createRelationshipTagAndProject(
        idTag: Long,
        idProject: Long,
    ) {

    }
}