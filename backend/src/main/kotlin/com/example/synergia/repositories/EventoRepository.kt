package com.example.synergia.repositories

import com.example.synergia.domain.Evento
import org.springframework.data.jpa.repository.JpaRepository

interface EventoRepository : JpaRepository<Evento, Long> {
}
