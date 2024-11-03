package com.example.synergia.mappers

import com.example.synergia.domain.Evento
import com.example.synergia.dto.entity_mirror.EventoDto
import com.example.synergia.dto.input.CreateEventoDto

class EventoMapper {
    fun entityToDto(entity: Evento): EventoDto {
        return EventoDto(
            entity.id!!,
            entity.titulo!!,
            entity.descricao!!,
            listOf(),
            listOf(),
            listOf(),
        )
    }

    fun dtoToEntity(dto: EventoDto): Evento {
        return Evento().apply {
            id = dto.idEvento
            titulo = dto.titulo
            descricao = dto.descricao
        }
    }
    fun dtoToEntity(dto: CreateEventoDto): Evento {
        return Evento().apply {
            titulo = dto.name
            descricao = dto.description
        }
    }
}
