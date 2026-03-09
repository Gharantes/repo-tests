package br.com.synergia.utilsEntities.models

data class EventDto(
    val id: Long,
    val idTenant: Long,
    val title: String,
    val description: String,
    var owner: AccountDto?,
    var tags: List<TagDto>,
    var projects: List<ProjectDto>
)
