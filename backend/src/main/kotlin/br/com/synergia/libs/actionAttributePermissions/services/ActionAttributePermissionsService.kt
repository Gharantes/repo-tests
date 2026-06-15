package br.com.synergia.libs.actionAttributePermissions.services

import br.com.synergia.libs.actionAttributePermissions.models.AttributePermissionsDto
import org.springframework.stereotype.Service

@Service
class ActionAttributePermissionsService (
    private val sqlService: ActionAttributePermissionsSqlService
) {
    fun attributePermissions(params: AttributePermissionsDto) {
        sqlService.attributePermissions(params)
    }
}