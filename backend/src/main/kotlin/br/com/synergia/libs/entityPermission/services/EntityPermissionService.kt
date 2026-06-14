package br.com.synergia.libs.entityPermission.services

import br.com.synergia.libs.utilsEntities.models.PermissionDto
import org.springframework.stereotype.Service

@Service
class EntityPermissionService (
    private val sqlService: EntityPermissionSqlService
) {
    fun listPermissions(text: String?): List<PermissionDto> {
        return sqlService.listPermissions(text)
    }
}