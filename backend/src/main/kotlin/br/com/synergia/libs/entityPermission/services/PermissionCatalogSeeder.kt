package br.com.synergia.libs.entityPermission.services

import br.com.synergia.libs.utilsCommons.enums.AuthPermissionsEnum
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

/**
 * Na subida da aplicação, deixa a tabela `permission` igual ao AuthPermissionsEnum.
 *
 * Na primeira subida depois que as permissões passaram a valer, ninguém tem nenhuma,
 * e todo mundo perderia acesso ao que já fazia. Por isso, enquanto não houver nenhuma
 * permissão concedida no banco, todas as contas existentes recebem todas. Daí em diante
 * quem decide é a página de Permissões.
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
            sqlService.listAllAccountIds().forEach { sqlService.grantPermissions(it, all) }
        }
    }
}
