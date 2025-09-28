package com.example.synergia.repositories.byDomain

import com.example.synergia.domain.AccountEntity
import org.springframework.data.jpa.repository.JpaRepository

interface AccountRepository : JpaRepository<AccountEntity, Long> {
}