package br.com.synergia.pageUpsertProjetos.models

data class CreateProjetoDto(
    val idTenant: Long,
    val idAccount: Long,
    val title: String,
    val description: String,
    val urlBanner: String? = null,
    val tags: List<Long>
)
