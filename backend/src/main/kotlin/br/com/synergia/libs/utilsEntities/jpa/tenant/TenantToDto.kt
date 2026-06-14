package br.com.synergia.libs.utilsEntities.jpa.tenant

import br.com.synergia.libs.utilsEntities.models.TenantDto

fun Tenant.toDto(): TenantDto {
    return TenantDto(
        id=id!!,
        title=title,
        identifier=identifier
    )
}