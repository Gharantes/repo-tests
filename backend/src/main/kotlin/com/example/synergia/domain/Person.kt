package com.example.synergia.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.time.LocalDate


@Entity
@Table(name = "person")
open class Person {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long? = null

    @Column(name = "id_tenant", nullable = false)
    open var idTenant: Long? = null

    @Column(name = "first_name", nullable = false)
    open var firstName: String? = null
    @Column(name = "last_name", nullable = false)
    open var lastName: String? = null

    @Column(name = "birthday", nullable = false)
    open var birthday: LocalDate? = null

    @Column(name = "id_account")
    open var idAccount: Long? = null
}
