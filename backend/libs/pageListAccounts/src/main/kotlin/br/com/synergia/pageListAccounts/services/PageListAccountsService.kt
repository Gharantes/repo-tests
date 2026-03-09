package br.com.synergia.pageListAccounts.services

import br.com.synergia.utilsEntities.models.AccountDto
import br.com.synergia.utilsEntities.services.EntityDeleteByIdService
import org.springframework.stereotype.Service

@Service
class PageListAccountsService (
    private val sqlService: PageListAccountsSqlService,
    private val entityDeleteByIdService: EntityDeleteByIdService
) {
    fun listAccounts(idTenant: Long, text: String?): List<AccountDto> {
        return sqlService.listAccounts(idTenant, text)
    }

    fun deleteAccount(idAccount: Long) {
        entityDeleteByIdService.deleteAccountById(idAccount)
    }
}