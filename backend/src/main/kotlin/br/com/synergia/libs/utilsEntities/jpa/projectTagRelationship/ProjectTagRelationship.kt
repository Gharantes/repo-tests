package br.com.synergia.libs.utilsEntities.jpa.projectTagRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "project_tag_relationship")
class ProjectTagRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_project", nullable = false)
    val idProject: Long = 0L,

    @Column(name = "id_tag", nullable = false)
    val idTag: Long = 0L
)