package com.example.synergia.services

import com.example.synergia.dto.entity_mirror.TenantDto
import com.example.synergia.dto.output.login_page.TenantLoginPageConfigInfoDto
import com.example.synergia.dto.utilities.IdentifierDto
import com.example.synergia.repositories.tenant.TenantJdbcRepository
import com.example.synergia.repositories.tenant.TenantRepository
import org.springframework.stereotype.Service


@Service
class TenantService (
    private val tenantRepository: TenantRepository,
) {
    fun getTenantByUniqueKeys(
        idTenant: Long?,
        identifier: String?
    ): IdentifierDto? {
        return tenantRepository.findTenantByIdOrIdentifier(idTenant, identifier)?.let {
            IdentifierDto(
                id=it.id!!,
                label=it.name!!
            )
        }
    }
    fun seeAllTenantsOnDatabase(): List<TenantDto>? {
        return tenantRepository.findAll().map {
            TenantDto(
                id = it.id!!,
                name = it.name!!,
                owner = it.owner!!,
                identifier = it.identifier!!
            )
        }
    }
}
