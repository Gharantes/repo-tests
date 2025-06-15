package com.example.synergia.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

@Entity
@Table(
    name = "tenant",
    uniqueConstraints = [
        UniqueConstraint(name="uk_tenant_identifier", columnNames = ["identifier"])
    ]
)
class TenantEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null

    @Column(name = "title", nullable = false)
    var title: String? = null

    @Column(name = "identifier", nullable = false)
    var identifier: String? = null
}