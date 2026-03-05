package br.com.synergia.pageExtendedEvento.services

import br.com.synergia.pageExtendedEvento.models.ListarProjetosOfEventoDto
import br.com.synergia.utilsCommons.models.generic.GenericIdTextDto
import org.springframework.stereotype.Service

@Service
class PageExtendedEventoService (
    private val sqlService: PageExtendedEventoSqlService
) {
    fun listarProjetosDoEvento(idEvento: Long): List<ListarProjetosOfEventoDto> {
        return sqlService.listarProjetosDoEvento(idEvento)
    }
    fun listarTagsDoEvento(idEvento: Long): List<GenericIdTextDto> {
        return sqlService.listarTagsDoEvento(idEvento)
    }
}