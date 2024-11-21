package com.example.synergia.mappers

import com.example.synergia.domain.Account
import com.example.synergia.dto.entity_mirror.AccountDto

class AccountMapper {
    fun entityToAccountDto(account: Account): AccountDto {
        return AccountDto(
            id = account.id!!,
            idTenant = account.idTenant!!,
            login = account.login!!
        )
    }
}