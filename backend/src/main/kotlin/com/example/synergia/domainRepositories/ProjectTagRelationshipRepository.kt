package com.example.synergia.domainRepositories

import com.example.synergia.domain.ProjectEventRelationshipEntity
import com.example.synergia.domain.ProjectTagRelationshipEntity
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectTagRelationshipRepository : JpaRepository<ProjectTagRelationshipEntity, Long> {
    fun deleteByIdProjectAndIdTag(idProject: Long, idTag: Long)
}