package br.com.synergia.entityEvent

import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.ProjectDto
import org.springframework.stereotype.Service

@Service
class EntityEventService (
    private val sqlService: EntityEventSqlService
) {
    fun listEventsByTenant(
        idTenant: Long,
        text: String? = null
    ): List<EventDto> {
        return sqlService.listEventsByTenant(idTenant, text)
    }
    fun listEventsByAccount(
        idAccount: Long,
        text: String? = null
    ): List<EventDto> {
        return sqlService.listEventsByAccount(idAccount, text)
    }
}