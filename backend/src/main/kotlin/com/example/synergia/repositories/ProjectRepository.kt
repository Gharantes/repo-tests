package com.example.synergia.repositories

import com.example.synergia.domain.Project
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectRepository : JpaRepository<Project, Long> {
    fun findByIdTenantAndId(idTenant: Long, id: Long): Project?

    fun findAllByIdTenant(idTenant: Long): List<Project>

    fun deleteByIdTenantAndId(idTenant: Long, id: Long)
}
