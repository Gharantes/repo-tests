package br.com.synergia.libs.utilsEntities.jpa.accountTagRelationship

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AccountTagRelationshipRepository : JpaRepository<AccountTagRelationship, Long> {
    @Transactional
    fun deleteAllByIdAccount(idAccount: Long)
}
