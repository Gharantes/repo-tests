package com.example.synergia.repositories

import com.example.synergia.domain.Projeto
import org.springframework.data.jpa.repository.JpaRepository

interface ProjetoRepository : JpaRepository<Projeto, Long> {
}
