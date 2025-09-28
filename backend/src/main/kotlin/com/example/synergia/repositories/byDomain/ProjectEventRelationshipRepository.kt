package com.example.synergia.repositories.byDomain

import com.example.synergia.domain.ProjectEventRelationshipEntity
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectEventRelationshipRepository : JpaRepository<ProjectEventRelationshipEntity, Long> {

    fun deleteByIdEvent(idEvent: Long)
    fun deleteByIdProject(idProject: Long)
    fun deleteByIdProjectAndIdEvent(idProject: Long, idEvent: Long)
}