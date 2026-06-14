package br.com.synergia.libs.utilsEntities.jpa.projectAccountRelationship

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table

@Entity
@Table(name = "project_account_relationship")
class ProjectAccountRelationship(

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true)
    val id: Long? = null,

    @Column(name = "id_project", nullable = false)
    val idProject: Long = 0L,

    @Column(name = "id_account", nullable = false)
    val idAccount: Long = 0L,

    @Column(name = "membership_label", nullable = false)
    var membershipLabel: String = "Integrante"
)