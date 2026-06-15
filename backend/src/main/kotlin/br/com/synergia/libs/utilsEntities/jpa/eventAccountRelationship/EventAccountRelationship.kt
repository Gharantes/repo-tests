package br.com.synergia.libs.utilsEntities.jpa.eventAccountRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "event_account_relationship")
class EventAccountRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_event", nullable = false)
    val idEvent: Long = 0L,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Column(name = "membership_label", nullable = false, length = 255)
    var membershipLabel: String = ""
)