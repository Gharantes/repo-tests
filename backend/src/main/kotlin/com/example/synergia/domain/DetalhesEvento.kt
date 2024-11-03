package com.example.synergia.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.OneToOne
import jakarta.persistence.Table

//@Entity
//@Table(name = "detalhesEvento")
//open class DetalhesEvento {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    open var id: Long? = null
//
//    /**
//     * Entidade "Filial(*is)" deve sempre pertencer a um "Cliente"
//     */
//    @OneToOne
//    @JoinColumn(name = "evento_id", nullable = false)
//    open var evento: Evento? = null
//
//    @Column(name = "name", nullable = false)
//    open var name: String? = null
//    @Column(name = "description", nullable = false)
//    open var description: String? = null
//
//}
