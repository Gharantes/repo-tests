package br.com.synergia.libs.entityPermission.models

/** O que está gravado para a conta, separado por origem (a página de Permissões edita os dois). */
data class AccountPermissionsDetailDto (
    val idPermissions: List<Long>,
    val idProfiles: List<Long>,
)
