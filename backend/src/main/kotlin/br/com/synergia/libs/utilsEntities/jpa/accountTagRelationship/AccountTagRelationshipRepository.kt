package br.com.synergia.libs.utilsEntities.jpa.accountTagRelationship

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface AccountTagRelationshipRepository : JpaRepository<AccountTagRelationship, Long> {
    fun deleteAllByIdAccount(idAccount: Long)
}
