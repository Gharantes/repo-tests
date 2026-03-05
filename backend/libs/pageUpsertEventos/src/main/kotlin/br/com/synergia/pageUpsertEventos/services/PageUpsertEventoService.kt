package br.com.synergia.pageUpsertEventos.services

import br.com.synergia.pageUpsertEventos.models.CreateEventoDto
import br.com.synergia.pageUpsertEventos.models.UpdateEventoDto
import org.springframework.stereotype.Service

@Service
class PageUpsertEventoService (
    private val sqlService: PageUpsertEventoSqlService,
) {
    fun getCreateEventoDtoById(id: Long): CreateEventoDto? {
        return sqlService.getCreateEventoDtoById(id)
    }
    fun createEvento(params: CreateEventoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }
        return sqlService.createEvento(params)
    }

    fun updateEvento(params: UpdateEventoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }
        return sqlService.updateEvento(params)
    }
}