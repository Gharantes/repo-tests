package br.com.synergia.utilsEntities.jpa.account

import br.com.synergia.utilsEntities.models.AccountDto

fun Account.toDto(): AccountDto {
    return AccountDto(
        id=id!!,
        idTenant=idTenant,
        login=login,
        email=email,
        firstName=firstName,
        lastName=lastName,
    )
}