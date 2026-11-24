package br.com.synergia.config.senha

import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationArguments
import org.springframework.boot.ApplicationRunner
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component

/**
 * Converte, quando o backend sobe, as senhas que ainda estão em texto puro (de
 * antes do hash) em hash bcrypt. Assim nenhuma conta antiga fica exposta no banco
 * esperando o dono fazer login de novo.
 *
 * Só toca nas linhas que ainda não são hash, então nas próximas subidas não faz
 * nada. Se der erro, registra no log e deixa o backend subir: o login continua
 * aceitando o formato antigo e converte a senha de quem entrar.
 */
@Component
class MigracaoSenhasTextoPuro(
    private val jdbc: JdbcTemplate,
    private val senhas: Senhas,
) : ApplicationRunner {

    private val log = LoggerFactory.getLogger(javaClass)

    override fun run(args: ApplicationArguments) {
        try {
            // O filtro do SQL é só uma pré-seleção; quem decide é Senhas.ehHash.
            val pendentes = jdbc.query("SELECT id, password FROM account WHERE password NOT LIKE '$2%'") { rs, _ ->
                rs.getLong("id") to rs.getString("password")
            }.filter { (_, senha) -> senha != null && !senhas.ehHash(senha) }

            if (pendentes.isEmpty()) return

            jdbc.batchUpdate(
                "UPDATE account SET password = ? WHERE id = ? AND password = ?",
                pendentes.map { (id, senha) -> arrayOf<Any>(senhas.gerarHash(senha), id, senha) },
            )
            log.info("Senhas em texto puro convertidas para hash bcrypt: {} conta(s).", pendentes.size)
        } catch (e: Exception) {
            log.error("Não foi possível converter as senhas em texto puro; o login converte cada uma quando o dono entrar.", e)
        }
    }
}
