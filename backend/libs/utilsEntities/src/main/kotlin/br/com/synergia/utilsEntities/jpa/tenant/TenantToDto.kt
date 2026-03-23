package br.com.synergia.utilsEntities.jpa.tenant

import br.com.synergia.utilsEntities.models.TenantDto

fun Tenant.toDto(): TenantDto {
    return TenantDto(
        id=id!!,
        title=title,
        identifier=identifier
    )
}