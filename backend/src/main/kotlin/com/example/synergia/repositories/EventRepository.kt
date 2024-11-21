package com.example.synergia.repositories

import com.example.synergia.domain.Event
import org.springframework.data.jpa.repository.JpaRepository

interface EventRepository : JpaRepository<Event, Long> {
    fun findByIdTenantAndId(idTenant: Long, id: Long): Event?

    fun findAllByIdTenant(idTenant: Long): List<Event>

    fun deleteByIdTenantAndId(idTenant: Long, id: Long)
}
