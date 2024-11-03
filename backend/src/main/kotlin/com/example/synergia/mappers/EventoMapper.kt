package com.example.synergia.mappers

import com.example.synergia.domain.Evento
import com.example.synergia.dto.entity_mirror.EventoDto
import com.example.synergia.dto.input.CreateEventoDto

class EventoMapper {
    fun entityToDto(entity: Evento): EventoDto {
        return EventoDto(
            entity.id!!,
            entity.name!!,
            entity.description!!,
            listOf(),
            listOf(),
            listOf(),
        )
    }

    fun dtoToEntity(dto: EventoDto): Evento {
        return Evento().apply {
            id = dto.idEvento
            name = dto.titulo
            description = dto.descricao
        }
    }
    fun dtoToEntity(dto: CreateEventoDto): Evento {
        return Evento().apply {
            name = dto.name
            description = dto.description
        }
    }
}
