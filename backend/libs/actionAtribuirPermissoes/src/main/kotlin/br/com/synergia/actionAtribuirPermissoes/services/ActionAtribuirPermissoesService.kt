package br.com.synergia.actionAtribuirPermissoes.services

import br.com.synergia.actionAtribuirPermissoes.models.AtribuirPermissoesDto
import org.springframework.stereotype.Service

@Service
class ActionAtribuirPermissoesService (
    private val sqlService: ActionAtribuirPermissoesSqlService
) {
    fun atribuirPermissoes(params: AtribuirPermissoesDto) {
        sqlService.atribuirPermissoes(params)
    }
}