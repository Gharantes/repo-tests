package br.com.synergia.libs.utilsEntities.jpa.tenant

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "tenant")
class Tenant(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "identifier", nullable = false, unique = true, length = 255)
    var identifier: String = "",

    @Column(name = "title", nullable = false, length = 255)
    var title: String = "",

    @Column(name = "is_private", nullable = false)
    var isPrivate: Boolean = false
)