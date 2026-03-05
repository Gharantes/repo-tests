package br.com.synergia.pageListPermissoes.services

import br.com.synergia.utilsCommons.models.entities.PermissaoDto
import org.springframework.stereotype.Service

@Service
class PageListPermissoesService (
    private val sqlService: PageListPermissoesSqlService
) {
    fun listarPermissoes(): List<PermissaoDto> {
        return sqlService.listarPermissoes()
    }
}