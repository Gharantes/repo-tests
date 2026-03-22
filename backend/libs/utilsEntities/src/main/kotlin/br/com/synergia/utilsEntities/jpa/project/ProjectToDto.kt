package br.com.synergia.utilsEntities.jpa.project

import br.com.synergia.utilsEntities.models.ProjectDto

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
        events=emptyList()
    )
}