package br.com.synergia.libs.entityProject.models

data class UpsertProjectDto(
    val idTenant: Long,
    val idAccount: Long,
    val title: String,
    val description: String,
    val bannerUrl: String?,
    val bannerColor: String? = null,
    val tags: List<Long>
)