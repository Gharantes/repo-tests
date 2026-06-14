package br.com.synergia.libs.utilsEntities.jpa.eventTagRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "event_tag_relationship")
class EventTagRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_event", nullable = false)
    val idEvent: Long = 0L,

    @Column(name = "id_tag", nullable = false)
    val idTag: Long = 0L
)