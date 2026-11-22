package br.com.synergia.libs.utilsEntities.jpa.permissionProfile

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDateTime

/** Conjunto de permissões com nome, definido por cada tenant (ex.: "Aluno", "Gestor de eventos"). */
@Entity
@Table(name = "permission_profile")
class PermissionProfile(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_tenant", nullable = false)
    val idTenant: Long = 0L,

    @Column(name = "title", nullable = false, length = 255)
    var title: String = "",

    @Column(name = "created_at", nullable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
)
