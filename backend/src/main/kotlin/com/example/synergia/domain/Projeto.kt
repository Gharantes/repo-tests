package com.example.synergia.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.Table


@Entity
@Table(name = "projeto")
open class Projeto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    open var id: Long? = null

//    @Column(name= "id_supervisor")
//    open var idSupervisor: Long? = null

    @Column(name = "titulo", nullable = false)
    open var titulo: String? = null
    @Column(name = "descricao", nullable = false)
    open var descricao: String? = null

//    @ManyToMany
//    open var eventos: MutableSet<Evento> = mutableSetOf()

    // The ManyToMany relationship with Evento
//    @ManyToMany(mappedBy = "projetos")  // Refers to 'projetos' in Evento
//    open var eventos: MutableSet<Evento> = mutableSetOf()
}
