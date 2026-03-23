package br.com.synergia.utilsEntities.jpa.tag

import br.com.synergia.utilsEntities.models.TagDto

fun Tag.toDto(): TagDto {
    return TagDto(
        id=this.id!!,
        idTenant=this.idTenant,
        title=this.title,
        createdAt=this.createdAt,
        forProjects=this.forProjects,
        forEvents=this.forEvents,
        forAccounts=this.forAccounts
    )
}