package br.com.synergia.libs.entityPermission.services

import br.com.synergia.libs.utilsCommons.enums.AuthPermissionsEnum
import br.com.synergia.libs.utilsEntities.jpa.accountPermissionProfileRelationship.AccountPermissionProfileRelationship
import br.com.synergia.libs.utilsEntities.jpa.accountPermissionProfileRelationship.AccountPermissionProfileRelationshipRepository
import br.com.synergia.libs.utilsEntities.jpa.accountPermissionRelationship.AccountPermissionRelationship
import br.com.synergia.libs.utilsEntities.jpa.accountPermissionRelationship.AccountPermissionRelationshipRepository
import br.com.synergia.libs.utilsEntities.jpa.permissionProfile.PermissionProfile
import br.com.synergia.libs.utilsEntities.jpa.permissionProfile.PermissionProfileRepository
import br.com.synergia.libs.utilsEntities.jpa.permissionProfilePermissionRelationship.PermissionProfilePermissionRelationship
import br.com.synergia.libs.utilsEntities.jpa.permissionProfilePermissionRelationship.PermissionProfilePermissionRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.PermissionDto
import br.com.synergia.libs.utilsEntities.models.PermissionProfileDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

/**
 * Sem efeitos colaterais: cada método grava ou lê só o que diz. As regras (quem pode,
 * validações, perfil padrão do admin) ficam no EntityPermissionService.
 *
 * Os métodos que gravam via JPA dão flush, porque as leituras de permissão efetiva são
 * SQL puro e, dentro da mesma transação, precisam enxergar o que acabou de mudar.
 */
@Service
class EntityPermissionSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val accountPermissionRepository: AccountPermissionRelationshipRepository,
    private val profileRepository: PermissionProfileRepository,
    private val profilePermissionRepository: PermissionProfilePermissionRelationshipRepository,
    private val accountProfileRepository: AccountPermissionProfileRelationshipRepository,
) {
    fun listPermissions(text: String?): List<PermissionDto> {
        val sql = SqlPath.PageListPermissions.LIST_PERMISSIONS.load()
        val paramMap = MapSqlParameterSource().addValue("text", text?.ifBlank { null }, Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.permissionRowMapper)
    }

    /** Permissões efetivas: avulsas + as dos perfis da conta. */
    fun listPermissionsOfAccount(idAccount: Long): List<PermissionDto> {
        val sql = SqlPath.EntityPermission.LIST_PERMISSIONS_OF_ACCOUNT.load()
        val paramMap = MapSqlParameterSource().addValue("id_account", idAccount, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.permissionRowMapper)
    }

    fun accountHasPermission(idAccount: Long, permission: AuthPermissionsEnum): Boolean =
        listPermissionsOfAccount(idAccount).any { it.id == permission.id }

    // ---------- Permissões avulsas ----------

    fun listDirectPermissionIds(idAccount: Long): List<Long> =
        accountPermissionRepository.findAllByIdAccount(idAccount).map { it.idPermission }

    fun grantPermissions(idAccount: Long, permissions: Collection<Long>) {
        accountPermissionRepository.saveAllAndFlush(
            permissions.distinct().map { AccountPermissionRelationship(idAccount = idAccount, idPermission = it) }
        )
    }

    fun revokeAllPermissions(idAccount: Long) {
        accountPermissionRepository.deleteAllByIdAccount(idAccount)
        accountPermissionRepository.flush()
    }

    // ---------- Perfis ----------

    fun listProfiles(idTenant: Long): List<PermissionProfileDto> {
        val profiles = profileRepository.findAllByIdTenantOrderByTitle(idTenant)
        val permissionsByProfile = profilePermissionRepository
            .findAllByIdProfileIn(profiles.mapNotNull { it.id })
            .groupBy({ it.idProfile }, { it.idPermission })
        return profiles.map { p ->
            PermissionProfileDto(
                id = p.id!!,
                idTenant = p.idTenant,
                title = p.title,
                idPermissions = permissionsByProfile[p.id].orEmpty().sorted(),
                accountCount = accountProfileRepository.countByIdProfile(p.id!!),
            )
        }
    }

    fun findProfile(idProfile: Long): PermissionProfile? = profileRepository.findById(idProfile).orElse(null)

    fun createProfile(idTenant: Long, title: String): Long =
        profileRepository.saveAndFlush(PermissionProfile(idTenant = idTenant, title = title)).id!!

    fun renameProfile(idProfile: Long, title: String) {
        profileRepository.findById(idProfile).ifPresent {
            it.title = title
            profileRepository.saveAndFlush(it)
        }
    }

    fun setProfilePermissions(idProfile: Long, permissions: Collection<Long>) {
        profilePermissionRepository.deleteAllByIdProfile(idProfile)
        profilePermissionRepository.flush()
        profilePermissionRepository.saveAllAndFlush(
            permissions.distinct().map { PermissionProfilePermissionRelationship(idProfile = idProfile, idPermission = it) }
        )
    }

    /** Apaga o perfil e o tira de todas as contas que o tinham. */
    fun deleteProfile(idProfile: Long) {
        accountProfileRepository.deleteAllByIdProfile(idProfile)
        profilePermissionRepository.deleteAllByIdProfile(idProfile)
        profileRepository.deleteById(idProfile)
        profileRepository.flush()
    }

    fun listProfileIdsOfAccount(idAccount: Long): List<Long> =
        accountProfileRepository.findAllByIdAccount(idAccount).map { it.idProfile }

    fun setAccountProfiles(idAccount: Long, idProfiles: Collection<Long>) {
        accountProfileRepository.deleteAllByIdAccount(idAccount)
        accountProfileRepository.flush()
        accountProfileRepository.saveAllAndFlush(
            idProfiles.distinct().map { AccountPermissionProfileRelationship(idAccount = idAccount, idProfile = it) }
        )
    }

    fun removeAllProfilesOfAccount(idAccount: Long) {
        accountProfileRepository.deleteAllByIdAccount(idAccount)
        accountProfileRepository.flush()
    }

    // ---------- Catálogo e utilidades ----------

    /** Cria ou atualiza a linha de `permission` correspondente a cada constante do enum. */
    fun upsertCatalog() {
        val sql = SqlPath.EntityPermission.UPSERT_PERMISSION.load()
        AuthPermissionsEnum.entries.forEach { p ->
            val paramMap = MapSqlParameterSource()
                .addValue("id", p.id, Types.BIGINT)
                .addValue("label", p.label, Types.VARCHAR)
                .addValue("description", p.description, Types.VARCHAR)
                .addValue("category", p.category, Types.VARCHAR)
            template.update(sql, paramMap)
        }
    }

    fun hasAnyGrant(): Boolean = accountPermissionRepository.count() > 0 || accountProfileRepository.count() > 0

    /** id_tenant -> ids das contas. */
    fun listAccountIdsByTenant(): Map<Long, List<Long>> =
        template.query("SELECT id, id_tenant FROM account", MapSqlParameterSource()) { rs, _ ->
            rs.getLong("id_tenant") to rs.getLong("id")
        }.groupBy({ it.first }, { it.second })

    fun getTenantOfAccount(idAccount: Long): Long? =
        template.queryForList(
            "SELECT id_tenant FROM account WHERE id = :id",
            MapSqlParameterSource().addValue("id", idAccount, Types.BIGINT),
            Long::class.java,
        ).firstOrNull()
}
