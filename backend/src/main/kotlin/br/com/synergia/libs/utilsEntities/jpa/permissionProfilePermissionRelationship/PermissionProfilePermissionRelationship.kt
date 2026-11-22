package br.com.synergia.libs.utilsEntities.jpa.permissionProfilePermissionRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

/** Quais permissões fazem parte de um perfil. */
@Entity
@Table(
    name = "permission_profile_permission_relationship",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_permission_profile_permission_relationship_id_profile_id_permission",
            columnNames = ["id_profile", "id_permission"],
        )
    ]
)
class PermissionProfilePermissionRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_profile", nullable = false)
    val idProfile: Long = 0L,

    @Column(name = "id_permission", nullable = false)
    val idPermission: Long = 0L
)
