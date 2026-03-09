package br.com.synergia.utilsEntities.services

import org.springframework.stereotype.Service

@Service
class EntityDeleteByIdService (
    private val sqlService: EntityDeleteByIdSqlService
) {
    fun deleteEventById(idEvent: Long) {
        sqlService.deleteEventById(idEvent)
    }
    fun deleteProjectEventRelationshipByIdEvent(idEvent: Long) {
        sqlService.deleteProjectEventRelationshipByIdEvent(idEvent)
    }
    fun deleteProjectEventRelationshipByIdProject(idProject: Long) {
        sqlService.deleteProjectEventRelationshipByIdProject(idProject)
    }
    fun deleteProjectById(idProject: Long) {
        sqlService.deleteProjectById(idProject)
    }
    fun deleteAccountById(idAccount: Long) {
        sqlService.deleteAccountById(idAccount)
    }
}