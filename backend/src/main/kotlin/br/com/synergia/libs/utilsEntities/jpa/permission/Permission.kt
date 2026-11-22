package br.com.synergia.libs.utilsEntities.jpa.permission

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

/** As linhas são escritas pelo PermissionCatalogSeeder a partir do AuthPermissionsEnum. */
@Entity
@Table(name = "permission")
class Permission(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "label", nullable = false, length = 255)
    var label: String = "",

    @Column(name = "description", length = 255)
    var description: String? = null,

    @Column(name = "category", length = 255)
    var category: String? = null,
)
