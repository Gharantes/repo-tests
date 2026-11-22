package br.com.synergia.libs.entityPermission.models

/**
 * Substitui os perfis e as permissões avulsas de `idAccount`. As permissões efetivas
 * da conta são as avulsas somadas às dos perfis.
 */
data class SetAccountPermissionsDto (
    /** Conta de quem está fazendo a alteração; precisa ter MANAGE_PERMISSIONS. */
    val idRequester: Long,
    val idAccount: Long,
    /** Permissões concedidas direto na conta, além das que vêm dos perfis. */
    val idPermissions: List<Long>,
    val idProfiles: List<Long>,
)
