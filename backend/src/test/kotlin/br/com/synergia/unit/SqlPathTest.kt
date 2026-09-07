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
 *
 * Dois arquivos estão vazios hoje e ficam listados à parte: as telas de permissão
 * ainda não foram implementadas. O teste registra isso explicitamente em vez de
 * fingir que passa.
 */
class SqlPathTest : FunSpec({

    val todosOsCaminhos: List<ISqlFile> =
        SqlPath.ActionAttributePermissions.entries +
            SqlPath.PageUpsertAccount.entries +
            SqlPath.PageLogin.entries +
            SqlPath.PageListTags.entries +
            SqlPath.EntityEvent.entries +
            SqlPath.EntityProject.entries +
            SqlPath.PageListPermissions.entries +
            SqlPath.EntityAccount.entries +
            SqlPath.PageListAccounts.entries +
            SqlPath.PageExtendedEvent.entries +
            SqlPath.PageExtendedProject.entries +
            SqlPath.PageExtendedAccount.entries

    // Arquivos que existem mas ainda não têm conteúdo, porque a funcionalidade
    // não foi implementada. Ficam fora da asserção de "não vazio" de propósito.
    val aindaSemImplementacao = setOf(
        "/sql/action-attribute-permissions/attribute-permissions.sql",
        "/sql/page-list-permissions/list-permissions.sql",
    )

    test("todo caminho declarado aponta para um arquivo que existe no classpath") {
        todosOsCaminhos.forEach { sqlFile ->
            withClue("Arquivo não encontrado: ${sqlFile.path}") {
                sqlFile.load() // lança se o recurso não existir
            }
        }
    }

    test("todo SQL implementado tem conteúdo") {
        todosOsCaminhos
            .filterNot { it.path in aindaSemImplementacao }
            .forEach { sqlFile ->
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
