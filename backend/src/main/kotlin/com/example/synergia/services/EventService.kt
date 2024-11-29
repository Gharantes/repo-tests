package com.example.synergia.services

import com.example.synergia.dto.entity_mirror.EventDto
import com.example.synergia.dto.input.EventCreateDto
import com.example.synergia.dto.input.EventUpdateDto
import com.example.synergia.mappers.EventMapper
import com.example.synergia.repositories.EventRepository
import com.example.synergia.utils.functions.nullOnEmptyStringElseWildcard
import jakarta.transaction.Transactional
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
    fun getAll(
        idTenant: Long,
        textSearch: String?
    ): List<EventDto> {
        val mapper = EventMapper()
//        return eventRepository.findAllByIdTenant(idTenant)
//            .map { mapper.entityToEventDto(it) }

        val searchPattern = textSearch.takeIf { !it.isNullOrBlank() }?.let { "%$it%" }

        if (searchPattern.isNullOrBlank()) {
            return eventRepository.findAllByIdTenant(idTenant).map {
                mapper.entityToEventDto(it)
            }
        }
        return eventRepository.findAllByIdTenantAndTitleLikeIgnoreCaseOrDescriptionLikeIgnoreCase(
            idTenant,
            searchPattern,
            searchPattern
        ).map {
            mapper.entityToEventDto(it)
        }

//        val a =
//        return eventRepository.findAllByIdTenantAndText(
//            idTenant,
//            a
//        ).map {
//            mapper.entityToEventDto(it)
//        }
    }
    fun createEvent(eventCreateDto: EventCreateDto) {
        eventRepository.save(
            EventMapper().eventCreateDtoToEntity(eventCreateDto)
        )
    }
    fun updateEvent(eventUpdateDto: EventUpdateDto) {
        val event = try {
            eventRepository.findById(eventUpdateDto.id).get()
        } catch (e: NoSuchElementException) {
            null
        }

        if (event == null) {
            return
        }

        event.apply {
            title = eventUpdateDto.title
            description = eventUpdateDto.description
        }

        eventRepository.save(event)
    }

    @Transactional
    fun deleteEvent(idTenant: Long, id: Long) {
        eventRepository.deleteByIdTenantAndId(idTenant, id)
    }
}
