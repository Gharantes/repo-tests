package br.com.synergia.libs.entityPermission.models

/** Substitui todas as permissões de `idAccount` por `idPermissions`. */
data class SetAccountPermissionsDto (
    /** Conta de quem está fazendo a alteração; precisa ter MANAGE_PERMISSIONS. */
    val idRequester: Long,
    val idAccount: Long,
    val idPermissions: List<Long>,
)
