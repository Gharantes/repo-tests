package br.com.synergia.libs.actionManageRelationships.services

import br.com.synergia.libs.utilsEntities.models.EventDto
import org.springframework.stereotype.Service

@Service
class ActionManageRelationshipsService (
    private val sqlService: ActionManageRelationshipsSqlService
) {
    fun listEventsOfProject(idProject: Long): List<EventDto> {
        return sqlService.listEventsOfProject(idProject)
    }
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