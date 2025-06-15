package com.example.synergia.domainRepositories

import com.example.synergia.domain.EventEntity
import org.springframework.data.jpa.repository.JpaRepository

interface EventRepository : JpaRepository<EventEntity, Long> {
}