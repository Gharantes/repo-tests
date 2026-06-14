package br.com.synergia.libs.entityEvent.services

import br.com.synergia.libs.entityEvent.models.UpsertEventDto
import br.com.synergia.libs.utilsCommons.extensions.parseStringToWildCard
import br.com.synergia.libs.utilsEntities.jpa.event.Event
import br.com.synergia.libs.utilsEntities.jpa.event.EventRepository
import br.com.synergia.libs.utilsEntities.jpa.eventAccountRelationship.EventAccountRelationship
import br.com.synergia.libs.utilsEntities.jpa.eventAccountRelationship.EventAccountRelationshipRepository
import br.com.synergia.libs.utilsEntities.jpa.eventTagRelationship.EventTagRelationship
import br.com.synergia.libs.utilsEntities.jpa.eventTagRelationship.EventTagRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.EventDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class EntityEventSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val eventRepository: EventRepository,
    private val eventAccountRelationshipRepository: EventAccountRelationshipRepository,
    private val eventTagRelationshipRepository: EventTagRelationshipRepository
) {
    fun listEventsByTenant(
        idTenant: Long,
        text: String? = null
    ): List<EventDto> {
        val sql = SqlPath.EntityEvent.LIST_EVENTS_BY_TENANT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.eventRowMapper)
    }

    fun listEventsByAccount(
        idAccount: Long,
        text: String?
    ): List<EventDto> {
        val sql = SqlPath.EntityEvent.LIST_EVENTS_BY_ACCOUNT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_account", idAccount, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.eventRowMapper)
    }

    fun listEventsByProject(
        idProject: Long,
        text: String? = null
    ): List<EventDto> {
        return emptyList()
    }

    fun createEvent(params: UpsertEventDto): Long {
        val event = Event(
            idTenant = params.idTenant,
            title = params.title,
            description = params.description,
            bannerUrl = params.bannerUrl
        )
        return eventRepository.save(event).id!!
    }

    fun createEventAccountRelationship(idEvent: Long, idAccount: Long) {
        val eventAccountRelationship = EventAccountRelationship(
            idAccount = idAccount,
            idEvent = idEvent,
            membershipLabel = "Organizador"
        )
        eventAccountRelationshipRepository.save(eventAccountRelationship)
    }

    fun createEventTagRelationship(idEvent: Long, idTag: List<Long>) {
        eventTagRelationshipRepository.saveAll(
            idTag.map {
                EventTagRelationship(idEvent=idEvent, idTag=it)
            }
        )
    }

    fun updateEvent(idEvent: Long, params: UpsertEventDto) {
        eventRepository.findById(idEvent).ifPresent { event ->
            event.title = params.title
            event.description = params.description
            event.bannerUrl = params.bannerUrl
            eventRepository.save(event)
        }
    }

    fun deleteEventTagRelationshipByIdEvent(idEvent: Long) {
        eventTagRelationshipRepository.deleteByIdEvent(idEvent)
    }
}