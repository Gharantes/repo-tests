package br.com.synergia.unit

import br.com.synergia.libs.utilsEntities.jpa.account.Account
import br.com.synergia.libs.utilsEntities.jpa.account.toDto
import br.com.synergia.libs.utilsEntities.jpa.project.Project
import br.com.synergia.libs.utilsEntities.jpa.project.toDto
import br.com.synergia.libs.utilsEntities.jpa.tag.Tag
import br.com.synergia.libs.utilsEntities.jpa.tag.toDto
import br.com.synergia.libs.utilsEntities.jpa.tenant.Tenant
import br.com.synergia.libs.utilsEntities.jpa.tenant.toDto
import io.kotest.assertions.throwables.shouldThrow
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.shouldBe
import java.time.LocalDateTime

/**
 * Testes de unidade da conversão entidade -> DTO.
 *
 * É a fronteira entre o que está no banco e o que a API devolve para o Angular.
 * Um campo trocado aqui (email no lugar de login, por exemplo) não quebra
 * compilação nem SQL: aparece como dado errado na tela. Por isso a checagem é
 * campo a campo, e não um `toString`.
 *
 * As entidades são construídas com valores reais, do mesmo formato que o banco
 * guarda; nada aqui é dublê de outra coisa.
 */
class EntityToDtoTest : FunSpec({

    context("Account.toDto") {
        test("copia todos os campos para as posições certas do DTO") {
            val account = Account(
                id = 42L,
                idTenant = 7L,
                login = "gharantes",
                password = "nao-deve-vazar",
                firstName = "Guilherme",
                lastName = "Arantes",
                email = "gharantes@fag.edu.br",
            )

            val dto = account.toDto()

            dto.id shouldBe 42L
            dto.idTenant shouldBe 7L
            dto.login shouldBe "gharantes"
            dto.email shouldBe "gharantes@fag.edu.br"
            dto.firstName shouldBe "Guilherme"
            dto.lastName shouldBe "Arantes"
        }

        test("o DTO não carrega a senha para fora da aplicação") {
            val dto = Account(id = 1L, password = "MinhaSenhaSecreta").toDto()

            // AccountDto simplesmente não tem campo de senha; o teste trava esse
            // contrato para que ninguém adicione um por engano.
            val campos = AccountDtoFieldNames.of(dto)
            campos.contains("password") shouldBe false
        }

        test("email nulo continua nulo, porque a coluna aceita nulo") {
            Account(id = 1L, email = null).toDto().email shouldBe null
        }

        test("estoura quando a entidade ainda não foi persistida") {
            // `toDto` usa `id!!`. Converter uma entidade sem id é erro de uso, e
            // é melhor falhar alto do que devolver um DTO com id inventado.
            shouldThrow<NullPointerException> { Account(id = null).toDto() }
        }
    }

    context("Project.toDto") {
        test("copia os campos próprios e deixa as coleções vazias para preenchimento posterior") {
            val project = Project(
                id = 10L,
                idTenant = 3L,
                title = "Robótica Colaborativa",
                description = "Projeto para a Startup Garage",
                bannerUrl = "https://exemplo.test/banner.png",
                bannerColor = "#B3D9FF",
            )

            val dto = project.toDto()

            dto.id shouldBe 10L
            dto.idTenant shouldBe 3L
            dto.title shouldBe "Robótica Colaborativa"
            dto.description shouldBe "Projeto para a Startup Garage"
            dto.bannerUrl shouldBe "https://exemplo.test/banner.png"
            dto.bannerColor shouldBe "#B3D9FF"

            // Tags, eventos e membros vêm de consultas separadas; o mapper as
            // deixa vazias de propósito.
            dto.tenant shouldBe null
            dto.tags.shouldBeEmpty()
            dto.events.shouldBeEmpty()
            dto.members.shouldBeEmpty()
        }

        test("banner_url nulo é preservado") {
            Project(id = 1L, bannerUrl = null).toDto().bannerUrl shouldBe null
        }

        test("a entidade crua não escolhe cor: quem sorteia é o SqlService") {
            // A cor do banner é atribuída em EntityProjectSqlService.createProject,
            // não no construtor da entidade. Este teste fixa essa divisão: se
            // alguém devolver o sorteio para a entidade, o projeto passaria a ter
            // duas fontes de cor. A checagem de que um projeto criado de verdade
            // recebe uma cor válida está no teste de integração, que é onde o
            // createProject roda.
            Project(id = 1L).toDto().bannerColor shouldBe ""
        }
    }

    context("Tag.toDto") {
        test("preserva as três flags de uso e a data de criação") {
            val criadaEm = LocalDateTime.of(2026, 3, 14, 9, 30)
            val tag = Tag(
                id = 5L,
                idTenant = 2L,
                title = "Design",
                forProjects = true,
                forEvents = false,
                forAccounts = true,
                createdAt = criadaEm,
            )

            val dto = tag.toDto()

            dto.id shouldBe 5L
            dto.idTenant shouldBe 2L
            dto.title shouldBe "Design"
            dto.forProjects shouldBe true
            dto.forEvents shouldBe false
            dto.forAccounts shouldBe true
            dto.createdAt shouldBe criadaEm
        }
    }

    context("Tenant.toDto") {
        test("expõe apenas id, title e identifier") {
            val dto = Tenant(id = 9L, identifier = "fag", title = "FAG", isPrivate = true).toDto()

            dto.id shouldBe 9L
            dto.identifier shouldBe "fag"
            dto.title shouldBe "FAG"

            // `isPrivate` fica de fora do DTO de propósito: é decisão interna do
            // tenant e não é consumida pelo frontend.
            AccountDtoFieldNames.of(dto).contains("isPrivate") shouldBe false
        }
    }
})

/** Lê os nomes de campo do DTO por reflexão, para travar o contrato público. */
private object AccountDtoFieldNames {
    fun of(dto: Any): Set<String> =
        dto::class.java.declaredFields.map { it.name }.toSet()
}
