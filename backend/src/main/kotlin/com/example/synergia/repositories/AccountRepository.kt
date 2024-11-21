package com.example.synergia.repositories

import com.example.synergia.domain.Account
import com.example.synergia.domain.Evento
import org.springframework.data.jpa.repository.JpaRepository

interface AccountRepository : JpaRepository<Account, Long> {
    fun findAccountByIdTenantAndLoginAndPassword(
        idTenant: Long,
        login: String,
        password: String
    ): Account?
}
