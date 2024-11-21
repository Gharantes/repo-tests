package com.example.synergia.repositories

import com.example.synergia.domain.Account
import org.springframework.data.jpa.repository.JpaRepository

interface AccountRepository : JpaRepository<Account, Long> {
    fun findByIdTenantAndLoginAndPassword(
        idTenant: Long,
        login: String,
        password: String
    ): Account?

    fun findByIdTenantAndId(idTenant: Long, id: Long): Account?

    fun findAllByIdTenant(idTenant: Long): List<Account>
}
