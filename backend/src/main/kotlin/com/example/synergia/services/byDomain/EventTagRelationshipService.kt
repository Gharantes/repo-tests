package com.example.synergia.services.byDomain

import com.example.synergia.domain.relationships.EventTagRelationshipEntity
import com.example.synergia.repositories.byDomain.relationships.EventTagRelationshipRepository
import org.springframework.stereotype.Service

@Service
class EventTagRelationshipService (
    private val eventTagRelationshipRepository: EventTagRelationshipRepository,
) : ITagRelationship {
    override fun getTags(idRef: Long): Set<Long> {
        return eventTagRelationshipRepository.findByIdEvent(idRef).map { it.idTag!! }.toSet()
    }
    override fun deleteTag(idRef: Long, idTag: Long) {
        eventTagRelationshipRepository.deleteByIdEventAndIdTag(idRef, idTag)
    }
    override fun insertTag(idRef: Long, idTag: Long) {
        val entity = EventTagRelationshipEntity()
        entity.idTag = idTag
        entity.idEvent = idRef
        eventTagRelationshipRepository.save(entity)
    }
}