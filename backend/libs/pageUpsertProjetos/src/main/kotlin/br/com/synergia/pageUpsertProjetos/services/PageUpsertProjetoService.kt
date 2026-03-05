package br.com.synergia.pageUpsertProjetos.services

import br.com.synergia.pageUpsertProjetos.models.CreateProjetoDto
import br.com.synergia.pageUpsertProjetos.models.UpdateProjetoDto
import org.springframework.stereotype.Service

@Service
class PageUpsertProjetoService (
    private val sqlService: PageUpsertProjetoSqlService
) {
    fun getCreateProjetoDtoById(id: Long): CreateProjetoDto? {
        return sqlService.getCreateProjetoDtoById(id)
    }
    fun createProjeto(params: CreateProjetoDto) {
        return sqlService.createProjeto(params)
    }
    fun updateProjeto(params: UpdateProjetoDto) {
        return sqlService.updateProjeto(params)
    }
}