package com.example.synergia.domain

import jakarta.persistence.*

@Entity
@Table(name = "tenant")
open class Tenant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(
        name = "tenant_seq",
        sequenceName = "tenant_seq",
        allocationSize = 1
    )
    open var id: Long? = null

    @Column(name = "name", nullable = false, length = 255)
    open var name: String? = null

    @Column(name = "owner", nullable = false, length = 255)
    open var owner: String? = null

    @Column(name = "identifier", nullable = false, length = 255)
    open var identifier: String? = null
}
