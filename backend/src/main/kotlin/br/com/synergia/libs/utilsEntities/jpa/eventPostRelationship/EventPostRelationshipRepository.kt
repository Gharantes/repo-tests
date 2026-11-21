package br.com.synergia.libs.utilsEntities.jpa.eventPostRelationship

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EventPostRelationshipRepository : JpaRepository<EventPostRelationship, Long> {
    @Transactional
    fun deleteByIdPost(idPost: Long)
}
