package com.example.synergia.domain

import jakarta.persistence.*

@Entity
@Table(name = "project")
class ProjectEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null

    @Column(name = "id_tenant", nullable = false)
    var idTenant: Long? = null

    @Column(name = "id_banner")
    var idBanner: Long? = null

    @Column(name = "created_by", nullable = false)
    var createdBy: Long? = null

    @Column(name = "title", nullable = false)
    var title: String? = null

    @Column(name = "description")
    var description: String? = null
}