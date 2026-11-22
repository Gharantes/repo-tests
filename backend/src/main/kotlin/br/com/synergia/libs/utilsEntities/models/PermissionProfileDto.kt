package br.com.synergia.libs.utilsEntities.models

data class PermissionProfileDto (
    val id: Long,
    val idTenant: Long,
    val title: String,
    val idPermissions: List<Long>,
    /** Quantas contas têm este perfil. */
    val accountCount: Long,
)
