package br.com.synergia.libs.utilsEntities.jpa.eventNoteRelationship

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EventNoteRelationshipRepository : JpaRepository<EventNoteRelationship, Long> {
    @Transactional
    fun deleteByIdNote(idNote: Long)
}
