package br.com.synergia.entityPermission.services

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