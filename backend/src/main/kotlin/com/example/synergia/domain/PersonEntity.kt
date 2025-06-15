package com.example.synergia.domain

import jakarta.persistence.*

@Entity
@Table(
    name = "person",
    uniqueConstraints = [
        UniqueConstraint(
            name="uk_person_id_account",
            columnNames = ["id_account"]
        )
    ]
)
class PersonEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null

    @Column(name = "id_tenant", nullable = false)
    var idTenant: Long? = null

    @Column(name = "id_account")
    var idAccount: Long? = null

    @Column(name = "first_name", nullable = false)
    var firstName: String? = null

    @Column(name = "last_name")
    var lastName: String? = null
}