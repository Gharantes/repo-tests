package br.com.synergia.utilsEntities.jpa.eventPostRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "event_post_relationship")
class EventPostRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_event", nullable = false)
    val idEvent: Long = 0L,
    @Column(name = "id_post", nullable = false)
    val idPost: Long = 0L,
)