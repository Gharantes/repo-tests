package br.com.synergia.actionAtribuirPermissoes.services

import br.com.synergia.actionAtribuirPermissoes.models.AtribuirPermissoesDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class ActionAtribuirPermissoesSqlService (
    private val template: NamedParameterJdbcTemplate
) {
    fun atribuirPermissoes(params: AtribuirPermissoesDto) {

    }
}