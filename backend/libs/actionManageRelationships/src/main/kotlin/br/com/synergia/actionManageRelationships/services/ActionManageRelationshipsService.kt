package br.com.synergia.actionManageRelationships.services

import org.springframework.stereotype.Service

@Service
class ActionManageRelationshipsService (
    private val sqlService: ActionManageRelationshipsSqlService
) {
    fun createRelationshipEventAndProject(
        idEvent: Long,
        idProject: Long,
    ) {
        sqlService.createRelationshipEventAndProject(idEvent, idProject)
    }
    fun removeRelationshipEventAndProject(
        idEvent: Long,
        idProject: Long,
    ) {
        sqlService.removeRelationshipEventAndProject(idEvent, idProject)
    }
    fun createRelationshipTagAndProject(
        idTag: Long,
        idProject: Long,
    ) {
        sqlService.createRelationshipTagAndProject(idTag, idProject)
    }
}