package com.example.synergia.services

import com.example.synergia.domain.Evento
import com.example.synergia.dto.entity_mirror.EventoDto
import com.example.synergia.dto.entity_mirror.ProjetoDto
import com.example.synergia.dto.input.CreateEventoDto
import com.example.synergia.mappers.EventoMapper
import com.example.synergia.mappers.ProjetoMapper
import com.example.synergia.repositories.EventoRepository
import org.springframework.stereotype.Service

@Service
class EventoService (
    private val eventoRepository: EventoRepository,
) {
    fun getById(idEvento: Long): EventoDto? {
        return eventoRepository.findById(idEvento)
            .map { EventoMapper().entityToDto(it) }
            .orElse(null)
    }
    fun getAll(): List<EventoDto> {
        return eventoRepository.findAll()
            .map { EventoMapper().entityToDto(it) }
    }
    fun createEvento(createEventoDto: CreateEventoDto): Evento {
        return eventoRepository.save(
            EventoMapper().dtoToEntity(createEventoDto)
        )
    }
    fun getProjetosOfEvento(idEvento: Long): List<ProjetoDto> {
        return eventoRepository.findById(idEvento)
            .map { it.projetos }
            .orElseThrow { Exception("Evento não encontrado") }
            .map { ProjetoMapper().entityToDto(it) }
    }
    fun deleteEvento(idEvento: Long) {
        eventoRepository.deleteById(idEvento)
    }
}
