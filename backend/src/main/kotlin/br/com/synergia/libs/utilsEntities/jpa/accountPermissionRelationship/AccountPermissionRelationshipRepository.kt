package br.com.synergia.libs.utilsEntities.jpa.accountPermissionRelationship

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AccountPermissionRelationshipRepository : JpaRepository<AccountPermissionRelationship, Long> {
    fun findAllByIdAccount(idAccount: Long): List<AccountPermissionRelationship>

    @Transactional
    fun deleteAllByIdAccount(idAccount: Long)
}
