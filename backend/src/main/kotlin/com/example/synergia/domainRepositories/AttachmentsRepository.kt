package com.example.synergia.domainRepositories

import com.example.synergia.domain.AttachmentsEntity
import org.springframework.data.jpa.repository.JpaRepository

interface AttachmentsRepository : JpaRepository<AttachmentsEntity, Long> {
}