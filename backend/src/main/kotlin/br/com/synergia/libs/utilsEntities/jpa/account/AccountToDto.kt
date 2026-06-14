package br.com.synergia.libs.utilsEntities.jpa.account

import br.com.synergia.libs.utilsEntities.models.AccountDto

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