package br.com.synergia.libs.utilsEntities.jpa.accountPermissionRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

@Entity
@Table(
    name = "account_permission_relationship",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_account_permission_relationship_id_account_id_permission",
            columnNames = ["id_account", "id_permission"],
        )
    ]
)
class AccountPermissionRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Column(name = "id_permission", nullable = false)
    val idPermission: Long = 0L
)
