package br.com.synergia.libs.utilsEntities.jpa.eventAccountRelationship

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface EventAccountRelationshipRepository : JpaRepository<EventAccountRelationship, Long>