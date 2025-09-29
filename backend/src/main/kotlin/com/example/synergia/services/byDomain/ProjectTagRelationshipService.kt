package com.example.synergia.services.byDomain

import com.example.synergia.domain.relationships.ProjectTagRelationshipEntity
import com.example.synergia.repositories.byDomain.relationships.ProjectTagRelationshipRepository
import org.springframework.stereotype.Service

@Service
class ProjectTagRelationshipService (
    private val projectTagRelationshipRepository: ProjectTagRelationshipRepository
) : ITagRelationship {
    override fun getTags(idRef: Long): Set<Long> {
        return projectTagRelationshipRepository.findByIdProject(idRef).map { it.idTag!! }.toSet()
    }
    override fun deleteTag(idRef: Long, idTag: Long) {
        projectTagRelationshipRepository.deleteByIdProjectAndIdTag(idRef, idTag)
    }
    override fun insertTag(idRef: Long, idTag: Long) {
        val entity = ProjectTagRelationshipEntity()
        entity.idTag = idTag
        entity.idProject = idRef
        projectTagRelationshipRepository.save(entity)
    }
}