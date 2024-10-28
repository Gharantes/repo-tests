package com.example.synergia.services

import com.example.synergia.dto.EventoDto
import com.example.synergia.dto.ProjetoDto
import org.springframework.stereotype.Service

@Service
class ProjetoService {
    fun getById(idProjeto: Long): ProjetoDto? {
        return getAll().firstOrNull { it.idProjeto == idProjeto }
    }
    fun getAll(): List<ProjetoDto> {
        return listOf(
            ProjetoDto(1, "1", listOf(), listOf()),
            ProjetoDto(2, "2", listOf(), listOf()),
        )
    }
}