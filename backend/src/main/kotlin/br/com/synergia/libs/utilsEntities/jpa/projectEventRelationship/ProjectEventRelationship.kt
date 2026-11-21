package br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

/** Projeto registrado em um evento. Um projeto pode estar em vários eventos. */
@Entity
@Table(
    name = "project_event_relationship",
    uniqueConstraints = [UniqueConstraint(
        name = "uk_project_event_relationship_id_project_id_event",
        columnNames = ["id_project", "id_event"]
    )]
)
class ProjectEventRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_project", nullable = false)
    val idProject: Long = 0L,

    @Column(name = "id_event", nullable = false)
    val idEvent: Long = 0L
)
