package br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProjectEventRelationshipRepository : JpaRepository<ProjectEventRelationship, Long> {
    fun existsByIdProjectAndIdEvent(idProject: Long, idEvent: Long): Boolean

    @Transactional
    fun deleteByIdProjectAndIdEvent(idProject: Long, idEvent: Long)
}
