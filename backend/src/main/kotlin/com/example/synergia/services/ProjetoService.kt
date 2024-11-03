package com.example.synergia.services

import com.example.synergia.domain.Projeto
import com.example.synergia.dto.entity_mirror.ProjetoDto
import com.example.synergia.dto.input.CreateProjetoDto
import com.example.synergia.mappers.ProjetoMapper
import com.example.synergia.repositories.EventoRepository
import com.example.synergia.repositories.ProjetoRepository
import org.springframework.stereotype.Service

@Service
class ProjetoService(
    private val projetoRepository: ProjetoRepository,
    private val eventoRepository: EventoRepository
) {
    fun getById(idProjeto: Long): ProjetoDto? {
        return projetoRepository.findById(idProjeto)
            .map { ProjetoMapper().entityToDto(it) }
            .orElse(null)
    }
    fun getAll(): List<ProjetoDto> {
        return projetoRepository.findAll()
            .map { ProjetoMapper().entityToDto(it) }
    }
    fun createProjeto(createProjetoDto: CreateProjetoDto): Projeto {
        return projetoRepository.save(
            ProjetoMapper().dtoToEntity(createProjetoDto)
        )
    }
    fun assignProjetoToEvento(
        idProjeto: Long,
        idEvento: Long
    ) {
        val projeto = projetoRepository.findById(idProjeto)
            .map { it }
            .orElseThrow { Exception("Projeto não encontrado") }

        val evento = eventoRepository.findById(idEvento)
            .map { it }
            .orElseThrow { Exception("Evento não encontrado") }

//        projeto.eventos.add(evento)
        projetoRepository.save(projeto)
    }

    fun deleteProjeto(idProjeto: Long) {
        projetoRepository.deleteById(idProjeto)
    }
}
