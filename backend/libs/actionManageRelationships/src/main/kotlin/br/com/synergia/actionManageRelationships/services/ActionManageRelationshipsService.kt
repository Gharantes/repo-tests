package br.com.synergia.actionManageRelationships.services

import org.springframework.stereotype.Service

@Service
class ActionManageRelationshipsService (
    private val sqlService: ActionManageRelationshipsSqlService
) {
    fun createRelationshipEventoAndProjeto(
        idEvento: Long,
        idProjeto: Long,
    ) {
        sqlService.createRelationshipEventoAndProjeto(idEvento, idProjeto)
    }
    fun removeRelationshipEventoAndProjeto(
        idEvento: Long,
        idProjeto: Long,
    ) {
        sqlService.removeRelationshipEventoAndProjeto(idEvento, idProjeto)
    }
    fun createRelationshipTagAndProjeto(
        idTag: Long,
        idProjeto: Long,
    ) {
        sqlService.createRelationshipTagAndProjeto(idTag, idProjeto)
    }
}