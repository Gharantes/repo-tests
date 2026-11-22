package br.com.synergia.libs.utilsEntities.jpa.accountPermissionProfileRelationship

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AccountPermissionProfileRelationshipRepository : JpaRepository<AccountPermissionProfileRelationship, Long> {
    fun findAllByIdAccount(idAccount: Long): List<AccountPermissionProfileRelationship>
    fun countByIdProfile(idProfile: Long): Long

    @Transactional
    fun deleteAllByIdAccount(idAccount: Long)

    @Transactional
    fun deleteAllByIdProfile(idProfile: Long)
}
