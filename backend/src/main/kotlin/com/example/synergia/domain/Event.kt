package com.example.synergia.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table

@Entity
@Table(name = "event")
open class Event {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "event_seq", sequenceName = "event_seq", allocationSize = 1)
    open var id: Long? = null

    @Column(name = "id_tenant", nullable = false)
    open var idTenant: Long? = null

    @Column(name = "title", nullable = false)
    open var title: String? = null

    @Column(name = "description", nullable = false)
    open var description: String? = null
}
