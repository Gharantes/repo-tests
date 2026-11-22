package br.com.synergia.libs.entityPermission.services

import br.com.synergia.libs.entityPermission.models.AccountPermissionsDetailDto
import br.com.synergia.libs.entityPermission.models.SetAccountPermissionsDto
import br.com.synergia.libs.entityPermission.models.UpsertPermissionProfileDto
import br.com.synergia.libs.utilsCommons.enums.AuthPermissionsEnum
import br.com.synergia.libs.utilsEntities.models.PermissionDto
import br.com.synergia.libs.utilsEntities.models.PermissionProfileDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

/**
 * Regras das permissões e dos perfis.
 *
 * O backend ainda não tem autenticação, então `idRequester` vem do cliente. As checagens
 * barram o uso pela interface, mas não substituem um login de verdade no servidor.
 *
 * Toda alteração termina conferindo que quem a fez continua com MANAGE_PERMISSIONS. Se não,
 * a exceção desfaz a transação: tirar a própria permissão (direto, pelo perfil, ou apagando
 * o perfil) deixaria a instituição sem ninguém para corrigir.
 */
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

    fun getAccountPermissionsDetail(idAccount: Long): AccountPermissionsDetailDto {
        return AccountPermissionsDetailDto(
            idPermissions = sqlService.listDirectPermissionIds(idAccount).sorted(),
            idProfiles = sqlService.listProfileIdsOfAccount(idAccount).sorted(),
        )
    }

    @Transactional(rollbackFor = [Exception::class])
    fun setAccountPermissions(params: SetAccountPermissionsDto) {
        val idTenant = requireManager(params.idRequester)
        if (sqlService.getTenantOfAccount(params.idAccount) != idTenant) {
            throw Exception("Usuário não encontrado.")
        }
        validatePermissionIds(params.idPermissions)
        params.idProfiles.forEach { requireProfileOfTenant(it, idTenant) }

        sqlService.revokeAllPermissions(params.idAccount)
        sqlService.grantPermissions(params.idAccount, params.idPermissions)
        sqlService.setAccountProfiles(params.idAccount, params.idProfiles)
        requireStillManager(params.idRequester)
    }

    fun listProfiles(idTenant: Long): List<PermissionProfileDto> {
        return sqlService.listProfiles(idTenant)
    }

    @Transactional(rollbackFor = [Exception::class])
    fun createProfile(params: UpsertPermissionProfileDto): Long {
        val idTenant = requireManager(params.idRequester)
        if (params.idTenant != idTenant) throw Exception("Instituição inválida.")
        val title = validateTitle(idTenant, params.title, idProfile = null)
        validatePermissionIds(params.idPermissions)

        val idProfile = sqlService.createProfile(idTenant, title)
        sqlService.setProfilePermissions(idProfile, params.idPermissions)
        return idProfile
    }

    @Transactional(rollbackFor = [Exception::class])
    fun updateProfile(idProfile: Long, params: UpsertPermissionProfileDto) {
        val idTenant = requireManager(params.idRequester)
        requireProfileOfTenant(idProfile, idTenant)
        val title = validateTitle(idTenant, params.title, idProfile)
        validatePermissionIds(params.idPermissions)

        sqlService.renameProfile(idProfile, title)
        sqlService.setProfilePermissions(idProfile, params.idPermissions)
        requireStillManager(params.idRequester)
    }

    @Transactional(rollbackFor = [Exception::class])
    fun deleteProfile(idProfile: Long, idRequester: Long) {
        val idTenant = requireManager(idRequester)
        requireProfileOfTenant(idProfile, idTenant)
        sqlService.deleteProfile(idProfile)
        requireStillManager(idRequester)
    }

    /** O admin de um tenant novo ganha o perfil "Administrador", com todas as permissões. */
    fun setUpTenantAdmin(idTenant: Long, idAdmin: Long) {
        val idProfile = sqlService.createProfile(idTenant, ADMIN_PROFILE_TITLE)
        sqlService.setProfilePermissions(idProfile, AuthPermissionsEnum.entries.map { it.id })
        sqlService.setAccountProfiles(idAdmin, listOf(idProfile))
    }

    fun grantDefaultPermissions(idAccount: Long) {
        sqlService.grantPermissions(idAccount, AuthPermissionsEnum.defaults().map { it.id })
    }

    /** Usado antes de apagar a conta. */
    fun revokeAllPermissions(idAccount: Long) {
        sqlService.revokeAllPermissions(idAccount)
        sqlService.removeAllProfilesOfAccount(idAccount)
    }

    // ---------- Validações ----------

    /** Devolve o tenant de quem pede, se a pessoa pode gerenciar permissões. */
    private fun requireManager(idRequester: Long): Long {
        val idTenant = sqlService.getTenantOfAccount(idRequester)
        if (idTenant == null || !sqlService.accountHasPermission(idRequester, AuthPermissionsEnum.MANAGE_PERMISSIONS)) {
            throw Exception("Você não tem permissão para alterar permissões.")
        }
        return idTenant
    }

    private fun requireStillManager(idRequester: Long) {
        if (!sqlService.accountHasPermission(idRequester, AuthPermissionsEnum.MANAGE_PERMISSIONS)) {
            throw Exception("Essa alteração tiraria de você a permissão de gerenciar permissões.")
        }
    }

    private fun requireProfileOfTenant(idProfile: Long, idTenant: Long) {
        if (sqlService.findProfile(idProfile)?.idTenant != idTenant) {
            throw Exception("Perfil não encontrado.")
        }
    }

    private fun validatePermissionIds(ids: List<Long>) {
        val unknown = ids.filter { AuthPermissionsEnum.byId(it) == null }
        if (unknown.isNotEmpty()) {
            throw Exception("Permissão inexistente: ${unknown.joinToString(", ")}.")
        }
    }

    private fun validateTitle(idTenant: Long, raw: String, idProfile: Long?): String {
        val title = raw.trim()
        if (title.isEmpty()) throw Exception("Dê um nome ao perfil.")
        if (title.length > 255) throw Exception("O nome do perfil é longo demais.")
        val clash = sqlService.listProfiles(idTenant).any { it.id != idProfile && it.title.equals(title, ignoreCase = true) }
        if (clash) throw Exception("Já existe um perfil chamado \"$title\".")
        return title
    }

    companion object {
        const val ADMIN_PROFILE_TITLE = "Administrador"
    }
}
