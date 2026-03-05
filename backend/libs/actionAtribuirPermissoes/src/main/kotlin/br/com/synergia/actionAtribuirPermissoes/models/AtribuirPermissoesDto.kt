package br.com.synergia.actionAtribuirPermissoes.models

data class AtribuirPermissoesDto (
    val idAccounts: List<Long>,
    val idPermissions: List<Long>
)