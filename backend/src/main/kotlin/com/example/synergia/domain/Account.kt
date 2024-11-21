package com.example.synergia.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table


@Entity
@Table(name = "account")
open class Account {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long? = null

    @Column(name= "id_tenant")
    open var idTenant: Long? = null

    @Column(name="login")
    open var login: String? = null

    @Column(name="password")
    open var password: String? = null
}
