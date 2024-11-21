package com.example.synergia.mappers

import com.example.synergia.domain.Event
import com.example.synergia.dto.entity_mirror.EventDto
import com.example.synergia.dto.input.EventCreateDto
import com.example.synergia.dto.input.EventUpdateDto

class EventMapper {
    fun entityToEventDto(entity: Event): EventDto {
        return EventDto(
            id = entity.id!!,
            idTenant = entity.idTenant!!,
            title = entity.title!!,
            description = entity.description!!,
        )
    }
    fun eventDtoToEntity(dto: EventDto): Event {
        return Event().apply {
            id = dto.id
            idTenant = dto.idTenant
            title = dto.title
            description = dto.description
        }
    }
    fun eventCreateDtoToEntity(dto: EventCreateDto): Event {
        return Event().apply {
            idTenant = dto.idTenant
            title = dto.title
            description = dto.description
        }
    }
    fun eventUpdateDtoToEntity(dto: EventUpdateDto): Event {
        return Event().apply {
            id = dto.id
            title = dto.title
            description = dto.description
        }
    }
}
