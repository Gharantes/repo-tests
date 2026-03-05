package br.com.synergia.actionManageRelationships.services

import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class ActionManageRelationshipsSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun createRelationshipEventoAndProjeto(
        idEvento: Long,
        idProjeto: Long,
    ) {

    }
    fun removeRelationshipEventoAndProjeto(
        idEvento: Long,
        idProjeto: Long,
    ) {

    }
    fun createRelationshipTagAndProjeto(
        idTag: Long,
        idProjeto: Long,
    ) {

    }
}