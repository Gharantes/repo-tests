package br.com.synergia.pageListPermissoes.services

import br.com.synergia.utilsCommons.models.entities.PermissaoDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListPermissoesSqlService (private val template: NamedParameterJdbcTemplate) {
    fun listarPermissoes(): List<PermissaoDto> {
        return emptyList()
    }
}