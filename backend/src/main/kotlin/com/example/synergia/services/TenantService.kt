package com.example.synergia.services

import com.example.synergia.domain.Tenant
import com.example.synergia.dto.output.TenantLoginPageConfigInfoDto
import com.example.synergia.dto.utilities.IdentifierDto
import com.example.synergia.repositories.TenantJdbcRepository
import com.example.synergia.repositories.TenantRepository
import org.springframework.stereotype.Service


@Service
class TenantService (
    private val tenantRepository: TenantRepository,
    private val tenantJdbcRepository: TenantJdbcRepository
) {
    fun getLoginPageConfigurationsOfTenantByTenantId(
        idTenant: Long
    ): TenantLoginPageConfigInfoDto? {
        return tenantJdbcRepository.getLoginPageConfigurationsOfTenantByTenantId(
            idTenant = idTenant
        )
    }

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
}
