package br.com.synergia.domain.relationships

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint

@Entity
@Table(
    name = "project_members",
    uniqueConstraints = [
        UniqueConstraint(
            name="uk_project_members_id_project_id_account",
            columnNames = ["id_project", "id_account"]
        )
    ]
)
class ProjectMembersEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null

    @Column(name = "id_project", nullable = false)
    var idProject: Long? = null

    @Column(name = "id_account", nullable = false)
    var idAccount: Long? = null
}