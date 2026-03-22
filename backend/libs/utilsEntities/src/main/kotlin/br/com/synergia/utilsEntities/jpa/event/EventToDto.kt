package br.com.synergia.utilsEntities.jpa.event

import br.com.synergia.utilsEntities.models.EventDto

fun Event.toDto(): EventDto {
    return EventDto(
        id=id!!,
        idTenant=idTenant,
        title=title,
        description=description,
        bannerUrl=bannerUrl,
        bannerColor=bannerColor,
        tags=emptyList(),
        projects=emptyList()
    )
}