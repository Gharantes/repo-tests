package br.com.synergia.pageUpsertProjects.models

data class UpsertProjectDto(
    val idTenant: Long,
    val idAccount: Long,
    val title: String,
    val description: String,
    val tags: List<Long>
)
