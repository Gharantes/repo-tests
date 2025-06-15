package com.example.synergia.domainRepositories

import com.example.synergia.domain.AccountEntity
import org.springframework.data.jpa.repository.JpaRepository

interface AccountRepository : JpaRepository<AccountEntity, Long> {
}