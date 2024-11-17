package com.example.synergia.repositories

import com.example.synergia.domain.Pessoa
import org.springframework.data.jpa.repository.JpaRepository

interface PersonRepository : JpaRepository<Pessoa, Long> {
}
