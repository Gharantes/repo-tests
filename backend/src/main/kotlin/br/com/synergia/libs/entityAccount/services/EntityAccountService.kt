package br.com.synergia.libs.entityAccount.services

import br.com.synergia.config.senha.PoliticaDeSenha
import br.com.synergia.libs.entityAccount.models.UpsertAccountDto
import br.com.synergia.libs.entityPermission.services.EntityPermissionService
import br.com.synergia.libs.entityTag.services.EntityTagService
import br.com.synergia.libs.utilsEntities.models.AccountDto
import org.springframework.stereotype.Service

@Service
class EntityAccountService (
    private val sqlService: EntityAccountSqlService,
    private val entityTagService: EntityTagService,
    private val entityPermissionService: EntityPermissionService,
) {
    fun listAccountsByTenant(idTenant: Long, text: String?, tagIds: List<Long>? = null, lookupTags: Boolean? = null): List<AccountDto> {
        val accounts = sqlService.listAccountsByTenant(idTenant, text, tagIds)
        if (lookupTags == true) {
            accounts.forEach { it.tags = entityTagService.listTagsByAccount(it.id, null) }
        }
        return accounts
    }
    fun createAccount(params: UpsertAccountDto) {
        if (params.password.isNullOrBlank()) {
            throw Exception("Senha inválida.")
        }
        PoliticaDeSenha.exigir(params.password)
        val idAccount = sqlService.createAccount(params)
        sqlService.createAccountTagRelationship(idAccount, params.tags)
        entityPermissionService.grantDefaultPermissions(idAccount)
    }
    fun updateAccount(idAccount: Long, params: UpsertAccountDto) {
        // Senha em branco na edição quer dizer "não mexer na senha"; senha nova passa pela política.
        params.password?.takeIf { it.isNotBlank() }?.let(PoliticaDeSenha::exigir)
        sqlService.updateAccount(idAccount, params)
        sqlService.deleteAccountTagRelationships(idAccount)
        sqlService.createAccountTagRelationship(idAccount, params.tags)
    }

    fun listAccountsByEvent(idEvent: Long, text: String?): List<AccountDto> {
        return sqlService.listAccountsByEvent(idEvent, text)
    }

    fun listAccountsByProject(idProject: Long, text: String?): List<AccountDto> {
        return sqlService.listAccountsByProject(idProject, text)
    }
}