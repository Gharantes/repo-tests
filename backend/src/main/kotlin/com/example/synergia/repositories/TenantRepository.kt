package com.example.synergia.repositories

import com.example.synergia.domain.Tenant
import org.springframework.data.jpa.repository.JpaRepository

interface TenantRepository : JpaRepository<Tenant, Long> {
    fun findTenantByIdOrIdentifier(
        id: Long?,
        identifier: String?
    ): Tenant?
}
