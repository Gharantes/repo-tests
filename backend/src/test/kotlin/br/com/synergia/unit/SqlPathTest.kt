package br.com.synergia.unit

import br.com.synergia.libs.utilsSql.ISqlFile
import br.com.synergia.libs.utilsSql.SqlPath
import io.kotest.assertions.withClue
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe

/**
 * Teste de unidade do catálogo de SQL.
 *
 * Todo caminho em [SqlPath] é uma string solta: o compilador não verifica se o
 * arquivo existe. Se alguém renomeia um `.sql` e esquece do enum, o erro só
 * aparece quando um usuário abre a tela correspondente, em produção. Este teste
 * carrega os arquivos de verdade do classpath e reprova antes disso.
 */
class SqlPathTest : FunSpec({

    val todosOsCaminhos: List<ISqlFile> =
        SqlPath.EntityPermission.entries +
            SqlPath.PageLogin.entries +
            SqlPath.PageListTags.entries +
            SqlPath.EntityEvent.entries +
            SqlPath.EntityProject.entries +
            SqlPath.EntityNote.entries +
            SqlPath.EntityPost.entries +
            SqlPath.EntityNotification.entries +
            SqlPath.EntityCalendar.entries +
            SqlPath.EntityMessage.entries +
            SqlPath.EntityTenant.entries +
            SqlPath.PageListPermissions.entries +
            SqlPath.EntityAccount.entries +
            SqlPath.PageListAccounts.entries +
            SqlPath.PageExtendedEvent.entries +
            SqlPath.PageExtendedProject.entries +
            SqlPath.PageExtendedAccount.entries

    test("todo caminho declarado aponta para um arquivo que existe no classpath") {
        todosOsCaminhos.forEach { sqlFile ->
            withClue("Arquivo não encontrado: ${sqlFile.path}") {
                sqlFile.load() // lança se o recurso não existir
            }
        }
    }

    test("todo SQL implementado tem conteúdo") {
        todosOsCaminhos.forEach { sqlFile ->
            withClue("SQL vazio em ${sqlFile.path}") {
                sqlFile.load().isBlank() shouldBe false
            }
        }
    }

    test("todo caminho declarado começa com /sql/ e termina em .sql") {
        todosOsCaminhos.forEach { sqlFile ->
            withClue(sqlFile.path) {
                sqlFile.path.startsWith("/sql/") shouldBe true
                sqlFile.path.endsWith(".sql") shouldBe true
            }
        }
    }

    test("não há dois enums apontando para o mesmo arquivo") {
        val caminhos = todosOsCaminhos.map { it.path }
        caminhos.distinct().size shouldBe caminhos.size
    }
})
