package com.example.synergia.repositories.byDomain

import com.example.synergia.domain.AttachmentsEntity
import org.springframework.data.jpa.repository.JpaRepository

interface AttachmentsRepository : JpaRepository<AttachmentsEntity, Long> {
}