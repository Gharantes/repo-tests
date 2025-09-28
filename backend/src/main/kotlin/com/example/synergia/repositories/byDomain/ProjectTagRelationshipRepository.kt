package com.example.synergia.repositories.byDomain

import com.example.synergia.domain.ProjectTagRelationshipEntity
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectTagRelationshipRepository : JpaRepository<ProjectTagRelationshipEntity, Long> {
    fun deleteByIdProjectAndIdTag(idProject: Long, idTag: Long)
}