package br.com.synergia.libs.actionAttributePermissions.models

data class AttributePermissionsDto (
    val idTenant: Long,
    val idAccounts: List<Long>,
    val idPermissions: List<Long>
)