package br.com.synergia.utilsEntities.models

data class ProjectDto (
    val id: Long,
    val idTenant: Long,
    val title: String,
    val description: String,
    val tenant: TenantDto,
    var tags: List<TagDto>,
    var events: List<EventDto>
)