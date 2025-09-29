package com.example.synergia.services.byDomain

import com.example.synergia.domain.relationships.EventTagRelationshipEntity

interface ITagRelationship {
    fun getTags(idRef: Long): Set<Long>
    fun deleteTag(idRef: Long, idTag: Long)
    fun insertTag(idRef: Long, idTag: Long)

    fun updateTags(idRef: Long, updatedTags: List<Long>) {
        val existing = getTags(idRef)
        val updated = updatedTags.toSet()

        val delete = existing.minus(updated)
        val insert = updated.minus(existing)

        delete.forEach { deleteTag(idRef, it) }
        insert.forEach { insertTag(idRef, it) }

    }
}