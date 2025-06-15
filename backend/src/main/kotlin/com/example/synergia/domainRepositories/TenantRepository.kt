package com.example.synergia.domainRepositories

import com.example.synergia.domain.TenantEntity
import org.springframework.data.jpa.repository.JpaRepository

interface TenantRepository : JpaRepository<TenantEntity, Long> {
}