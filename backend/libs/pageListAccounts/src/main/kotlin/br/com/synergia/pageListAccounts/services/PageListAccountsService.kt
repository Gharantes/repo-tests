package br.com.synergia.pageListAccounts.services

import br.com.synergia.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.utilsEntities.models.AccountDto
import org.springframework.stereotype.Service

@Service
class PageListAccountsService (
    private val sqlService: PageListAccountsSqlService,
    private val accountRepository: AccountRepository
) {
    fun listAccounts(idTenant: Long, text: String?): List<AccountDto> {
        return sqlService.listAccounts(idTenant, text)
    }
    fun deleteAccount(idAccount: Long) {
        accountRepository.deleteById(idAccount)
    }
}