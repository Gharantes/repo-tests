package com.example.synergia.repositories.byDomain.relationships

import com.example.synergia.domain.relationships.ProjectTagRelationshipEntity
import jakarta.transaction.Transactional
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying

interface ProjectTagRelationshipRepository : JpaRepository<ProjectTagRelationshipEntity, Long> {
    @Transactional
    @Modifying
    fun deleteByIdProjectAndIdTag(idProject: Long, idTag: Long)

    fun findByIdProject(idProject: Long): List<ProjectTagRelationshipEntity>
}