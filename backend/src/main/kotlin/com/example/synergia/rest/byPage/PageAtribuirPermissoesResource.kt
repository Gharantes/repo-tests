package com.example.synergia.rest.byPage

import com.example.synergia.models.byPage.pageAtribuirPermissoes.dto.input.ManyAccountsOnePermissionDto
import com.example.synergia.models.byPage.pageAtribuirPermissoes.dto.input.OneAccountManyPermissionsDto
import com.example.synergia.models.byPage.pageAtribuirPermissoes.dto.output.ListarPermissoesDto
import com.example.synergia.services.byPage.PageListarPermissoesService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController @RequestMapping("/api/atribuir-permissoes")
class PageAtribuirPermissoesResource (
    private val service: PageListarPermissoesService
) {
    @PostMapping("/all-permissions")
    fun listarPermissoesAll(): ResponseEntity<List<ListarPermissoesDto>> =
        ResponseMessenger.buildResponse { service.listarPermissoesAll() }

    @PostMapping("one-account-many-permissions")
    fun oneAccountManyPermissionsUpdate(
        @RequestBody params: OneAccountManyPermissionsDto
    ): ResponseEntity<Void> =
        ResponseMessenger.responseWithoutReturn { service.oneAccountManyPermissionsUpdate(params) }

    @PostMapping("many-accounts-one-permission")
    fun manyAccountsOnePermissionUpdate(
        @RequestBody params: ManyAccountsOnePermissionDto
    ): ResponseEntity<Void> =
        ResponseMessenger.responseWithoutReturn { service.manyAccountsOnePermissionUpdate(params) }

}