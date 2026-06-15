package br.com.synergia.libs.utilsEntities.jpa.accountTagRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "account_tag_relationship")
class AccountTagRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Column(name = "id_tag", nullable = false)
    val idTag: Long = 0L
)
