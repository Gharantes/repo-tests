package com.example.synergia.repositories.byDomain.relationships

import com.example.synergia.domain.relationships.EventTagRelationshipEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying

interface EventTagRelationshipRepository : JpaRepository<EventTagRelationshipEntity, Long> {
    @Transactional
    @Modifying
    fun deleteByIdEventAndIdTag(idEvent: Long, idTag: Long)

    fun findByIdEvent(idEvent: Long): List<EventTagRelationshipEntity>
}