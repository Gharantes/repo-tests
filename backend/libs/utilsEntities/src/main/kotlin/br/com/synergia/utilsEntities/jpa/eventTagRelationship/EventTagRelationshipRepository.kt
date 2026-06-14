package br.com.synergia.utilsEntities.jpa.eventTagRelationship

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EventTagRelationshipRepository : JpaRepository<EventTagRelationship, Long> {
    @Transactional
    fun deleteByIdEvent(idEvent: Long) {}
}