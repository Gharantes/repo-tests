package br.com.synergia.pageListPermissoes.services

import br.com.synergia.utilsEntities.models.PermissionDto
import org.springframework.stereotype.Service

@Service
class PageListPermissionsService (
    private val sqlService: PageListPermissionsSqlService
) {
    fun listPermissions(text: String?): List<PermissionDto> {
        return sqlService.listPermissions(text)
    }
}