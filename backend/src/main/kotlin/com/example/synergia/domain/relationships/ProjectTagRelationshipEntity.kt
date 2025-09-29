package com.example.synergia.domain.relationships

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

@Entity
@Table(
    name = "project_tag_relationship",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_project_tag_relationship_id_project_id_tag",
            columnNames = ["id_project", "id_tag"]
        )
    ])
class ProjectTagRelationshipEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null

    @Column(name = "id_project", nullable = false)
    var idProject: Long? = null

    @Column(name = "id_tag", nullable = false)
    var idTag: Long? = null
}