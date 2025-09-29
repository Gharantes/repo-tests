package com.example.synergia.repositories.byDomain

import com.example.synergia.domain.TenantEntity
import org.springframework.data.jpa.repository.JpaRepository

interface TenantRepository : JpaRepository<TenantEntity, Long> {
}