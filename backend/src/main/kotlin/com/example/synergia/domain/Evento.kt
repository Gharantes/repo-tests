package com.example.synergia.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.JoinTable
import jakarta.persistence.ManyToMany
import jakarta.persistence.OneToOne
import jakarta.persistence.SequenceGenerator
import jakarta.persistence.Table

@Entity
@Table(name = "evento")
open class Evento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @SequenceGenerator(name = "evento_seq", sequenceName = "evento_seq", allocationSize = 1)
    open var id: Long? = null

//    @OneToOne(mappedBy = "evento")
//    open var detalhesEvento: DetalhesEvento? = null

    @Column(name = "titulo", nullable = false)
    open var titulo: String? = null
    @Column(name = "descricao", nullable = false)
    open var descricao: String? = null

//    @ManyToMany(mappedBy = "eventos")
//    open var projetos: MutableSet<Projeto> = mutableSetOf()

    // The ManyToMany relationship with Projeto
//    @ManyToMany
//    @JoinTable(
//        name = "evento_projeto",  // Name of the join table
//        joinColumns = [JoinColumn(name = "evento_id")],  // Column for Evento ID
//        inverseJoinColumns = [JoinColumn(name = "projeto_id")]  // Column for Projeto ID
//    )
//    open var projetos: MutableSet<Projeto> = mutableSetOf()
}
