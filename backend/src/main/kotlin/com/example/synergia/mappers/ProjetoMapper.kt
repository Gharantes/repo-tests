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
            entity.titulo!!,
            listOf(),
            listOf(),
        )
    }
    fun dtoToEntity(dto: ProjetoDto): Projeto {
        return Projeto().apply {
            id = dto.idProjeto
            titulo = dto.titulo
            descricao = dto.titulo
        }
    }
    fun dtoToEntity(dto: CreateProjetoDto): Projeto {
        return Projeto().apply {
            titulo = dto.name
            descricao = dto.description
        }
    }
}
