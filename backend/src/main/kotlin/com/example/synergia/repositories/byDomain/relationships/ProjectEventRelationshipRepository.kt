package com.example.synergia.repositories.byDomain.relationships

import com.example.synergia.domain.relationships.ProjectEventRelationshipEntity
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectEventRelationshipRepository : JpaRepository<ProjectEventRelationshipEntity, Long> {

    fun deleteByIdEvent(idEvent: Long)
    fun deleteByIdProject(idProject: Long)
    fun deleteByIdProjectAndIdEvent(idProject: Long, idEvent: Long)
}