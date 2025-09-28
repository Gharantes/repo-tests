package com.example.synergia.repositories.byDomain

import com.example.synergia.domain.PersonEntity
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Optional

interface PersonRepository : JpaRepository<PersonEntity, Long> {
    fun findByIdAccount(idAccount: Long): Optional<PersonEntity>
}