package com.example.synergia.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import kotlin.math.min

@Entity
@Table(
    name = "project_event_relationship",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_project_event_relationship_id_project_id_event",
            columnNames = ["id_project", "id_event"]
        )
    ])
class ProjectEventRelationshipEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null

    @Column(name = "id_project", nullable = false)
    var idProject: Long? = null

    @Column(name = "id_event", nullable = false)
    var idEvent: Long? = null
}