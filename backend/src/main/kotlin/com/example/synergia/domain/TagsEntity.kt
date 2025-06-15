package com.example.synergia.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import jakarta.persistence.UniqueConstraint
import java.time.LocalDateTime

@Entity
@Table(
    name = "tags",
    uniqueConstraints = [
        UniqueConstraint(name="uk_tags_id_tenant_name", columnNames = ["id_tenant", "name"])
    ]
)
class TagsEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Long? = null

    @Column(name = "id_tenant", nullable = false)
    var idTenant: Long? = null

    @Column(name = "name", nullable = false)
    var name: String? = null

    @Column(name = "created_at", nullable = false)
    var createdAt: LocalDateTime? = null
}