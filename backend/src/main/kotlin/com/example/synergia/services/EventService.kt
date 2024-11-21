package com.example.synergia.services

import com.example.synergia.domain.Event
import com.example.synergia.dto.entity_mirror.AccountDto
import com.example.synergia.dto.entity_mirror.EventDto
import com.example.synergia.dto.entity_mirror.ProjectDto
import com.example.synergia.dto.input.EventCreateDto
import com.example.synergia.dto.input.EventUpdateDto
import com.example.synergia.mappers.AccountMapper
import com.example.synergia.mappers.EventMapper
import com.example.synergia.repositories.EventRepository
import org.springframework.stereotype.Service

@Service
class EventService (
    private val eventRepository: EventRepository,
) {
    fun getById(idTenant: Long, id: Long): EventDto? {
        return eventRepository.findByIdTenantAndId(idTenant, id)?.let {
            EventMapper().entityToEventDto(it)
        }
    }
    fun getAll(idTenant: Long): List<EventDto> {
        val mapper = EventMapper()
        return eventRepository.findAllByIdTenant(idTenant)
            .map { mapper.entityToEventDto(it) }
    }
    fun createEvent(eventCreateDto: EventCreateDto) {
        eventRepository.save(
            EventMapper().eventCreateDtoToEntity(eventCreateDto)
        )
    }
    fun updateEvent(eventUpdateDto: EventUpdateDto) {
        eventRepository.save(
            EventMapper().eventUpdateDtoToEntity(eventUpdateDto)
        )
    }
    fun deleteEvent(idTenant: Long, id: Long) {
        eventRepository.deleteByIdTenantAndId(idTenant, id)
    }
}
