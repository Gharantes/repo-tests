package br.com.synergia.entityPermission.services

import br.com.synergia.utilsEntities.models.PermissionDto
import org.springframework.stereotype.Service

@Service
class EntityPermissionService (
    private val sqlService: EntityPermissionSqlService
) {
    fun listPermissions(text: String?): List<PermissionDto> {
        return sqlService.listPermissions(text)
    }
}