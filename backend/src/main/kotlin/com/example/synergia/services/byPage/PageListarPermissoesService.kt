package com.example.synergia.services.byPage

import com.example.synergia.models.byPage.pageAtribuirPermissoes.dto.input.ManyAccountsOnePermissionDto
import com.example.synergia.models.byPage.pageAtribuirPermissoes.dto.input.OneAccountManyPermissionsDto
import com.example.synergia.models.byPage.pageAtribuirPermissoes.dto.output.ListarPermissoesDto
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