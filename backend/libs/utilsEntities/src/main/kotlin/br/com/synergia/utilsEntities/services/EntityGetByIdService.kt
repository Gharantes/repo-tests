package br.com.synergia.utilsEntities.services

import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.models.TenantDto
import org.springframework.stereotype.Service


@Service
class EntityGetByIdService (private val sqlService: EntityGetByIdSqlService) {
    fun getEventById(idEvent: Long): EventDto? {
        return sqlService.getEventById(idEvent)
    }
    fun getTenantById(idTenant: Long): TenantDto? {
        return sqlService.getTenantById(idTenant)
    }
    fun getProjectById(idProject: Long): ProjectDto? {
        return sqlService.getProjectById(idProject)
    }
}