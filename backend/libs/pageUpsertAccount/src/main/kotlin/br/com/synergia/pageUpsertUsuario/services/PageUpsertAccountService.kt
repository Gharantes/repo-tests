package br.com.synergia.pageUpsertUsuario.services

import br.com.synergia.pageUpsertUsuario.models.UpsertAccountDto
import org.springframework.stereotype.Service

@Service
class PageUpsertAccountService (
    private val sqlService: PageUpsertAccountSqlService
) {
    fun accountExistsWithSameLoginOrEmail(
        idTenant: Long,
        login: String,
        email: String,
        idAccount: Long?
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
        sqlService.updateAccount(params)
    }
}