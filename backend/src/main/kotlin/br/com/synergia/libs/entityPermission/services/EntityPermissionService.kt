package br.com.synergia.libs.entityPermission.services

import br.com.synergia.libs.entityPermission.models.SetAccountPermissionsDto
import br.com.synergia.libs.utilsCommons.enums.AuthPermissionsEnum
import br.com.synergia.libs.utilsEntities.models.PermissionDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class EntityPermissionService (
    private val sqlService: EntityPermissionSqlService
) {
    fun listPermissions(text: String?): List<PermissionDto> {
        return sqlService.listPermissions(text)
    }

    fun listPermissionsOfAccount(idAccount: Long): List<PermissionDto> {
        return sqlService.listPermissionsOfAccount(idAccount)
    }

    /**
     * O backend ainda não tem autenticação, então `idRequester` vem do cliente. A checagem
     * barra o uso pela interface, mas não substitui um login de verdade no servidor.
     */
    @Transactional(rollbackFor = [Exception::class])
    fun setAccountPermissions(params: SetAccountPermissionsDto) {
        if (!sqlService.accountHasPermission(params.idRequester, AuthPermissionsEnum.MANAGE_PERMISSIONS)) {
            throw Exception("Você não tem permissão para alterar permissões.")
        }
        val tenantOfRequester = sqlService.getTenantOfAccount(params.idRequester)
        val tenantOfTarget = sqlService.getTenantOfAccount(params.idAccount)
        if (tenantOfTarget == null || tenantOfRequester != tenantOfTarget) {
            throw Exception("Usuário não encontrado.")
        }
        val unknown = params.idPermissions.filter { AuthPermissionsEnum.byId(it) == null }
        if (unknown.isNotEmpty()) {
            throw Exception("Permissão inexistente: ${unknown.joinToString(", ")}.")
        }
        if (params.idRequester == params.idAccount &&
            AuthPermissionsEnum.MANAGE_PERMISSIONS.id !in params.idPermissions
        ) {
            throw Exception("Você não pode tirar de si mesmo a permissão de gerenciar permissões.")
        }
        sqlService.revokeAllPermissions(params.idAccount)
        sqlService.grantPermissions(params.idAccount, params.idPermissions)
    }

    fun grantAllPermissions(idAccount: Long) {
        sqlService.grantPermissions(idAccount, AuthPermissionsEnum.entries.map { it.id })
    }

    fun grantDefaultPermissions(idAccount: Long) {
        sqlService.grantPermissions(idAccount, AuthPermissionsEnum.defaults().map { it.id })
    }

    fun revokeAllPermissions(idAccount: Long) {
        sqlService.revokeAllPermissions(idAccount)
    }
}
