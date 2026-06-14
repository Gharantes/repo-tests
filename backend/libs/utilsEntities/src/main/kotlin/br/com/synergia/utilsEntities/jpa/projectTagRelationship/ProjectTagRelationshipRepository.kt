package br.com.synergia.utilsEntities.jpa.projectTagRelationship

import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProjectTagRelationshipRepository : JpaRepository<ProjectTagRelationship, Long> {
    @Transactional
    fun deleteByIdProject(idProject: Long) {}
}