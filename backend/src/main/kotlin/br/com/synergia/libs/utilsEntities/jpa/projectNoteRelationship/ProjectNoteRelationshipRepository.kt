package br.com.synergia.libs.utilsEntities.jpa.projectNoteRelationship

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProjectNoteRelationshipRepository : JpaRepository<ProjectNoteRelationship, Long> {
    @Transactional
    fun deleteByIdNote(idNote: Long)
}
