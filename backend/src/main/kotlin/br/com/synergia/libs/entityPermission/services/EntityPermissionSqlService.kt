package br.com.synergia.libs.entityPermission.services

import br.com.synergia.libs.utilsCommons.enums.AuthPermissionsEnum
import br.com.synergia.libs.utilsEntities.jpa.accountPermissionRelationship.AccountPermissionRelationship
import br.com.synergia.libs.utilsEntities.jpa.accountPermissionRelationship.AccountPermissionRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.PermissionDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class EntityPermissionSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val accountPermissionRepository: AccountPermissionRelationshipRepository,
) {
    fun listPermissions(text: String?): List<PermissionDto> {
        val sql = SqlPath.PageListPermissions.LIST_PERMISSIONS.load()
        val paramMap = MapSqlParameterSource().addValue("text", text?.ifBlank { null }, Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.permissionRowMapper)
    }

    fun listPermissionsOfAccount(idAccount: Long): List<PermissionDto> {
        val sql = SqlPath.EntityPermission.LIST_PERMISSIONS_OF_ACCOUNT.load()
        val paramMap = MapSqlParameterSource().addValue("id_account", idAccount, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.permissionRowMapper)
    }

    fun accountHasPermission(idAccount: Long, permission: AuthPermissionsEnum): Boolean =
        accountPermissionRepository.findAllByIdAccount(idAccount).any { it.idPermission == permission.id }

    fun grantPermissions(idAccount: Long, permissions: Collection<Long>) {
        accountPermissionRepository.saveAll(
            permissions.distinct().map { AccountPermissionRelationship(idAccount = idAccount, idPermission = it) }
        )
    }

    fun revokeAllPermissions(idAccount: Long) {
        accountPermissionRepository.deleteAllByIdAccount(idAccount)
        // Sem isso o INSERT que vem logo depois, na mesma transação, bate na unique constraint.
        accountPermissionRepository.flush()
    }

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

    fun hasAnyGrant(): Boolean = accountPermissionRepository.count() > 0

    fun listAllAccountIds(): List<Long> =
        template.queryForList("SELECT id FROM account", MapSqlParameterSource(), Long::class.java).filterNotNull()

    fun getTenantOfAccount(idAccount: Long): Long? =
        template.queryForList(
            "SELECT id_tenant FROM account WHERE id = :id",
            MapSqlParameterSource().addValue("id", idAccount, Types.BIGINT),
            Long::class.java,
        ).firstOrNull()
}
