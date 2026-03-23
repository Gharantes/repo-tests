package br.com.synergia.actionAttributePermissions.models

data class AttributePermissionsDto (
    val idTenant: Long,
    val idAccounts: List<Long>,
    val idPermissions: List<Long>
)