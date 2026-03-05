package br.com.synergia.pageListProjetos.services

import br.com.synergia.utilsCommons.models.entities.ProjetoDto
import org.springframework.stereotype.Service

@Service
class PageListProjetosService (
    private val sqlService: PageListProjetosSqlService
) {
    fun listarProjetos(idTenant: Long, idAccount: Long, text: String?): List<ProjetoDto> {
        return sqlService.listarProjetos(idTenant, idAccount, text)
    }
    fun deletarProjeto(idProjeto: Long) {
        sqlService.deletarProjeto(idProjeto)
    }
}