package br.com.synergia.libs.utilsEntities.models

data class EventDto(
    val id: Long,
    val idTenant: Long,
    val title: String,
    val description: String,
    val bannerUrl: String?,
    val bannerColor: String,
    var tags: List<TagDto>,
    var projects: List<ProjectDto>,
    var members: List<AccountDto>
)
