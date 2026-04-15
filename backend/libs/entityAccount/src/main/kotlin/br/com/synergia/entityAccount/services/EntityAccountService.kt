package br.com.synergia.entityAccount.services

import br.com.synergia.entityAccount.models.UpsertAccountDto
import br.com.synergia.utilsEntities.models.AccountDto
import org.springframework.stereotype.Service

@Service
class EntityAccountService (
    private val sqlService: EntityAccountSqlService
) {
    fun listAccountsByTenant(idTenant: Long, text: String?): List<AccountDto> {
        return sqlService.listAccountsByTenant(idTenant, text)
    }
    fun getAccountByLoginOrEmail(
        idTenant: Long,
        idAccount: Long?,
        login: String?,
        email: String?
    ): Boolean {
        val res = sqlService.getAccountByLoginOrEmail(idTenant, login, email)
        if (res == null) return false
        if (idAccount == null) return true
        return res.id != idAccount
    }
    fun createAccount(params: UpsertAccountDto) {
        sqlService.createAccount(params)
    }
    fun updateAccount(idAccount: Long, params: UpsertAccountDto) {
        sqlService.updateAccount(idAccount, params)
    }

    fun listAccountsByEvent(idEvent: Long, text: String?): List<AccountDto> {
        return emptyList()
    }
}