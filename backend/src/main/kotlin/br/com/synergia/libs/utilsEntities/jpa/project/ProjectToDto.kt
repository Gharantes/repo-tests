package br.com.synergia.libs.utilsEntities.jpa.project

import br.com.synergia.libs.utilsEntities.models.ProjectDto

fun Project.toDto(): ProjectDto {
    return ProjectDto(
        id=id!!,
        idTenant=idTenant,
        title=title,
        description=description,
        tenant=null,
        bannerUrl=bannerUrl,
        bannerColor=bannerColor,
        tags=emptyList(),
        events=emptyList(),
        members=emptyList()
    )
}