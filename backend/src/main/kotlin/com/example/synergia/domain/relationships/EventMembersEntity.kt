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
    name = "event_members",
    uniqueConstraints = [
        UniqueConstraint(
            name="uk_event_members_id_event_id_account",
            columnNames = ["id_event", "id_account"]
        )
    ]
)
class EventMembersEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null

    @Column(name = "id_event", nullable = false)
    var idEvent: Long? = null

    @Column(name = "id_account", nullable = false)
    var idAccount: Long? = null
}