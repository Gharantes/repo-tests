package br.com.synergia.libs.entityAccount.services

import br.com.synergia.libs.entityAccount.models.UpsertAccountDto
import br.com.synergia.libs.entityTag.services.EntityTagService
import br.com.synergia.libs.utilsEntities.models.AccountDto
import org.springframework.stereotype.Service

@Service
class EntityAccountService (
    private val sqlService: EntityAccountSqlService,
    private val entityTagService: EntityTagService
) {
    fun listAccountsByTenant(idTenant: Long, text: String?, lookupTags: Boolean? = null): List<AccountDto> {
        val accounts = sqlService.listAccountsByTenant(idTenant, text)
        if (lookupTags == true) {
            accounts.forEach { it.tags = entityTagService.listTagsByAccount(it.id, null) }
        }
        return accounts
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
        val idAccount = sqlService.createAccount(params)
        sqlService.createAccountTagRelationship(idAccount, params.tags)
    }
    fun updateAccount(idAccount: Long, params: UpsertAccountDto) {
        sqlService.updateAccount(idAccount, params)
        sqlService.deleteAccountTagRelationships(idAccount)
        sqlService.createAccountTagRelationship(idAccount, params.tags)
    }

    fun listAccountsByEvent(idEvent: Long, text: String?): List<AccountDto> {
        return emptyList()
    }
}