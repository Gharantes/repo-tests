package br.com.synergia.libs.utilsEntities.jpa.permissionProfilePermissionRelationship

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface PermissionProfilePermissionRelationshipRepository : JpaRepository<PermissionProfilePermissionRelationship, Long> {
    fun findAllByIdProfileIn(idProfiles: Collection<Long>): List<PermissionProfilePermissionRelationship>

    @Transactional
    fun deleteAllByIdProfile(idProfile: Long)
}
