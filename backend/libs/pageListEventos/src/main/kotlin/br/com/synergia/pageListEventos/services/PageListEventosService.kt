package br.com.synergia.pageListEventos.services

import br.com.synergia.pageListEventos.models.FiltroListarEventosAllDto
import br.com.synergia.pageListEventos.models.FiltroListarEventosByIdDto
import br.com.synergia.pageListEventos.models.ListarEventosDto
import org.springframework.stereotype.Service

@Service
class PageListEventosService (
    private val sqlService: PageListEventosSqlService
) {
    fun listarEventos(
        params: FiltroListarEventosAllDto
    ): List<ListarEventosDto> {
        return sqlService.listarEventosAll(params)
    }

    fun deletarEvento(idEvento: Long) {
//        sqlService.deleteProjetoEventoRelationship(id) // TODO
        sqlService.deletarEvento(idEvento)
    }

    fun listarEventosById(params: FiltroListarEventosByIdDto): ListarEventosDto? {
        return sqlService.getEventoById(params)
    }
}