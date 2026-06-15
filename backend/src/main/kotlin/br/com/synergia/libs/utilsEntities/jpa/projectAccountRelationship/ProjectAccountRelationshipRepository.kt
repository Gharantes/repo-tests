package br.com.synergia.libs.utilsEntities.jpa.projectAccountRelationship

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface ProjectAccountRelationshipRepository : JpaRepository<ProjectAccountRelationship, Long>