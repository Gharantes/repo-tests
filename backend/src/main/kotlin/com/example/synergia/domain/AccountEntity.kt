package com.example.synergia.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.time.LocalDateTime

@Entity
@Table(
    name = "account",
    uniqueConstraints = [
        UniqueConstraint(
            name="uk_account_id_tenant_login",
            columnNames = ["id_tenant", "login"]
        )
    ]
)
class AccountEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null
    @Column(name = "id_tenant", nullable = false)
    var idTenant: Long? = null

    @Column(name = "login", nullable = false)
    var login: String? = null

    @Column(name = "password", nullable = false)
    var password: String? = null

    @Column(name = "last_seen") var lastSeen: LocalDateTime? = null
    @Column(name = "created_at") var createdAt: LocalDateTime? = null
    @Column(name = "updated_at") var updatedAt: LocalDateTime? = null
}