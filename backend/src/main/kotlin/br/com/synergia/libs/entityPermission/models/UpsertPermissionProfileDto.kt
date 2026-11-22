package br.com.synergia.libs.entityPermission.models

data class UpsertPermissionProfileDto (
    /** Conta de quem está fazendo a alteração; precisa ter MANAGE_PERMISSIONS. */
    val idRequester: Long,
    val idTenant: Long,
    val title: String,
    val idPermissions: List<Long>,
)
