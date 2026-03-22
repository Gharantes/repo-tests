package br.com.synergia.utilsEntities.jpa.tenant

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.Optional

@Repository
interface TenantRepository : JpaRepository<Tenant, Long> {
    fun findByIdentifier(identifier: String) : Optional<Tenant>
}