package br.com.synergia.libs.utilsEntities.jpa.account

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "account")
class Account(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_tenant", nullable = false)
    val idTenant: Long = 0L,

    @Column(name = "login", nullable = false, unique = true, length = 255)
    var login: String = "",

    @Column(name = "password", nullable = false, length = 255)
    var password: String = "",

    @Column(name = "first_name", nullable = false, length = 255)
    var firstName: String = "",

    @Column(name = "last_name", nullable = false, length = 255)
    var lastName: String = "",

    @Column(name = "email", length = 255)
    var email: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at", nullable = false)
    var updatedAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "last_seen", nullable = false)
    var lastSeen: LocalDateTime = LocalDateTime.now()
)