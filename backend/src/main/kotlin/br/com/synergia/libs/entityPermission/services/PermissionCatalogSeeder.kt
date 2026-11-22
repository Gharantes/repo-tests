package br.com.synergia.libs.entityPermission.services

import br.com.synergia.libs.utilsCommons.enums.AuthPermissionsEnum
import br.com.synergia.libs.entityPermission.services.EntityPermissionService.Companion.ADMIN_PROFILE_TITLE
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

/**
 * Na subida da aplicação, deixa a tabela `permission` igual ao AuthPermissionsEnum.
 *
 * Na primeira subida depois que as permissões passaram a valer, ninguém tem nenhuma,
 * e todo mundo perderia acesso ao que já fazia. Por isso, enquanto não houver nenhuma
 * permissão concedida no banco, cada tenant ganha um perfil "Administrador" com todas
 * as permissões, atribuído a todas as contas dele. Daí em diante quem decide é a página
 * de Permissões.
 */
@Component
class PermissionCatalogSeeder (
    private val sqlService: EntityPermissionSqlService,
) : ApplicationRunner {
    @Transactional(rollbackFor = [Exception::class])
    override fun run(args: ApplicationArguments) {
        sqlService.upsertCatalog()
        if (!sqlService.hasAnyGrant()) {
            val all = AuthPermissionsEnum.entries.map { it.id }
            sqlService.listAccountIdsByTenant().forEach { (idTenant, idAccounts) ->
                val idProfile = sqlService.listProfiles(idTenant).firstOrNull { it.title == ADMIN_PROFILE_TITLE }?.id
                    ?: sqlService.createProfile(idTenant, ADMIN_PROFILE_TITLE)
                sqlService.setProfilePermissions(idProfile, all)
                idAccounts.forEach { sqlService.setAccountProfiles(it, listOf(idProfile)) }
            }
        }
    }
}
