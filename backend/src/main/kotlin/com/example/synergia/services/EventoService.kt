package com.example.synergia.services

import com.example.synergia.dto.EventoDto
import org.springframework.stereotype.Service

@Service
class EventoService {
    fun getById(idEvento: Long): EventoDto? {
        return getAll().filter { it.idEvento == idEvento }.firstOrNull()
    }
    fun getAll(): List<EventoDto> {
        return listOf(
            EventoDto(1, "1", "", listOf(), listOf(), listOf()),
            EventoDto(2, "2", "", listOf(), listOf(), listOf()),
        )
    }
}