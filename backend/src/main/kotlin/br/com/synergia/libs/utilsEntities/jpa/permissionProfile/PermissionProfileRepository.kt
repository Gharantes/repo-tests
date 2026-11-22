package br.com.synergia.libs.utilsEntities.jpa.permissionProfile

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PermissionProfileRepository : JpaRepository<PermissionProfile, Long> {
    fun findAllByIdTenantOrderByTitle(idTenant: Long): List<PermissionProfile>
}
