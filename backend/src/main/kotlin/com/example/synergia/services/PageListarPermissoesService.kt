package com.example.synergia.services

import com.example.synergia.rest.pageAtribuirPermissoes.input.ManyAccountsOnePermissionDto
import com.example.synergia.rest.pageAtribuirPermissoes.input.OneAccountManyPermissionsDto
import com.example.synergia.rest.pageAtribuirPermissoes.output.ListarPermissoesDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageListarPermissoesService (private val template: NamedParameterJdbcTemplate) {
    fun listarPermissoesAll(): List<ListarPermissoesDto> {
        return emptyList()
    }

    fun oneAccountManyPermissionsUpdate(params: OneAccountManyPermissionsDto) {
    }

    fun manyAccountsOnePermissionUpdate(params: ManyAccountsOnePermissionDto) {
    }
}