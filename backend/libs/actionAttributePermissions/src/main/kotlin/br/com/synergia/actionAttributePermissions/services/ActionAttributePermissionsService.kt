package br.com.synergia.actionAttributePermissions.services

import br.com.synergia.actionAttributePermissions.models.AttributePermissionsDto
import org.springframework.stereotype.Service

@Service
class ActionAttributePermissionsService (
    private val sqlService: ActionAttributePermissionsSqlService
) {
    fun attributePermissions(params: AttributePermissionsDto) {
        sqlService.attributePermissions(params)
    }
}