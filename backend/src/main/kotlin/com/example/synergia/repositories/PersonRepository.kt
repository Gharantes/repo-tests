package com.example.synergia.repositories

import com.example.synergia.domain.Evento
import com.example.synergia.domain.Pessoa
import org.springframework.data.jpa.repository.JpaRepository

interface PessoaRepository : JpaRepository<Pessoa, Long> {
}
