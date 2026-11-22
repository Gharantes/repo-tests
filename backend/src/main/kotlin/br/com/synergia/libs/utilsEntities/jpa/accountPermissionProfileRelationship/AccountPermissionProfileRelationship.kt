package br.com.synergia.libs.utilsEntities.jpa.accountPermissionProfileRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

/** Perfis atribuídos a uma conta. As permissões do perfil valem enquanto o vínculo existir. */
@Entity
@Table(
    name = "account_permission_profile_relationship",
    uniqueConstraints = [
        UniqueConstraint(
            name = "uk_account_permission_profile_relationship_id_account_id_profile",
            columnNames = ["id_account", "id_profile"],
        )
    ]
)
class AccountPermissionProfileRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Column(name = "id_profile", nullable = false)
    val idProfile: Long = 0L
)
