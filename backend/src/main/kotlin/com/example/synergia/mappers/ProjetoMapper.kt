package com.example.synergia.mappers

import com.example.synergia.domain.Evento
import com.example.synergia.domain.Projeto
import com.example.synergia.dto.entity_mirror.EventoDto
import com.example.synergia.dto.entity_mirror.ProjetoDto
import com.example.synergia.dto.input.CreateEventoDto
import com.example.synergia.dto.input.CreateProjetoDto

class ProjetoMapper {
    fun entityToDto(entity: Projeto): ProjetoDto {
        return ProjetoDto(
            entity.id!!,
            entity.name!!,
            listOf(),
            listOf(),
        )
    }
    fun dtoToEntity(dto: ProjetoDto): Projeto {
        return Projeto().apply {
            id = dto.idProjeto
            name = dto.titulo
            description = dto.titulo
        }
    }
    fun dtoToEntity(dto: CreateProjetoDto): Projeto {
        return Projeto().apply {
            name = dto.name
            description = dto.description
        }
    }
}
