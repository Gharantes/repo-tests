package br.com.synergia.libs.utilsEntities.jpa.projectNoteRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "project_note_relationship")
class ProjectNoteRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_project", nullable = false)
    val idProject: Long = 0L,

    @Column(name = "id_note", nullable = false, unique = true)
    val idNote: Long = 0L
)
