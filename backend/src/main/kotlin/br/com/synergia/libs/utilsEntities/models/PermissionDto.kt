package br.com.synergia.libs.utilsEntities.models

data class PermissionDto (
    val id: Long,
    /** Código da permissão (ex.: CREATE_TAG); é o que o frontend confere. */
    val name: String,
    val description: String?,
    val category: String?,
)
