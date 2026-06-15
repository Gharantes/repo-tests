package br.com.synergia.libs.utilsEntities.jpa.tag

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

@Entity
@Table(name = "tags")
class Tag(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_tenant", nullable = false)
    val idTenant: Long = 0L,

    @Column(name = "title", nullable = false, length = 255)
    var title: String = "",

    @Column(name = "for_projects", nullable = false)
    var forProjects: Boolean = false,

    @Column(name = "for_events", nullable = false)
    var forEvents: Boolean = false,

    @Column(name = "for_accounts", nullable = false)
    var forAccounts: Boolean = false,

    @Column(name = "created_at", nullable = false, updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now()
)