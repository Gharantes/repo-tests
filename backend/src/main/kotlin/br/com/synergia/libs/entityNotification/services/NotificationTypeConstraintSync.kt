package br.com.synergia.libs.entityNotification.services

import br.com.synergia.libs.utilsCommons.enums.ActivityTypeEnum
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

/**
 * Na subida da aplicação, deixa o CHECK de `notification.type` igual ao ActivityTypeEnum.
 *
 * O Hibernate (ddl-auto: update) cria o CHECK com os valores do enum na hora em que cria a
 * tabela, mas nunca o atualiza depois. Quando entrou o tipo DATE (datas do calendário), os bancos
 * já existentes continuaram recusando o valor novo. Recriar o CHECK a partir do enum resolve
 * agora e para qualquer tipo que entrar depois.
 */
@Component
class NotificationTypeConstraintSync (
    private val jdbc: JdbcTemplate,
) : ApplicationRunner {
    @Transactional(rollbackFor = [Exception::class])
    override fun run(args: ApplicationArguments) {
        // Os valores vêm do enum, não de quem chama: dá para montar o SQL direto.
        val allowed = ActivityTypeEnum.entries.joinToString(", ") { "'${it.name}'" }
        jdbc.execute("ALTER TABLE notification DROP CONSTRAINT IF EXISTS notification_type_check")
        jdbc.execute("ALTER TABLE notification ADD CONSTRAINT notification_type_check CHECK (type IN ($allowed))")
    }
}
