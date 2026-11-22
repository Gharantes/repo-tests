package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.getForList
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.libs.entityAccount.models.UpsertAccountDto
import br.com.synergia.libs.entityPermission.models.SetAccountPermissionsDto
import br.com.synergia.libs.entityTenant.models.UpsertTenantDto
import br.com.synergia.libs.utilsCommons.enums.AuthPermissionsEnum
import br.com.synergia.libs.utilsEntities.models.PermissionDto
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

/**
 * Integração das permissões: o catálogo vindo do enum, quem recebe o quê ao ser
 * criado e as travas de quem pode alterar as permissões de quem.
 */
@DisplayName("Integração: permissões")
class EntityPermissionIntegrationTest : IntegrationTestBase() {

    private val listar = "/api/entity-permission/list-permissions"
    private val listarDaConta = "/api/entity-permission/list-permissions-of-account"
    private val definir = "/api/entity-permission/set-account-permissions"

    private fun permissoesDe(idConta: Long): List<String> =
        rest.getForList<PermissionDto>("$listarDaConta?id-account=$idConta").body.shouldNotBeNull().map { it.name }

    private fun conceder(idConta: Long, vararg permissoes: AuthPermissionsEnum) {
        jdbc.batchUpdate(
            "INSERT INTO account_permission_relationship (id_account, id_permission) VALUES (?, ?)",
            permissoes.map { arrayOf<Any>(idConta, it.id) },
        )
    }

    @Test
    fun `o catálogo tem uma linha por constante do enum`() {
        val lista = rest.postForList<PermissionDto>(listar).body.shouldNotBeNull()

        lista.map { it.name } shouldContainExactlyInAnyOrder AuthPermissionsEnum.entries.map { it.label }
        lista.first { it.name == "CREATE_TAG" }.category shouldBe "Tags"
    }

    @Test
    fun `o admin criado junto com o tenant recebe todas as permissões`() {
        rest.postJson<Void>(
            "/api/entity-tenant/store",
            UpsertTenantDto(title = "FAG", identifier = "fag", login = "ADMIN", password = "senha"),
        ).statusCode shouldBe HttpStatus.OK
        val idAdmin = jdbc.queryForObject("SELECT id FROM account WHERE login = 'ADMIN'", Long::class.java)!!

        permissoesDe(idAdmin) shouldContainExactlyInAnyOrder AuthPermissionsEnum.entries.map { it.label }
    }

    @Test
    fun `conta nova criada pela página de usuários recebe só as permissões padrão`() {
        val idTenant = criarTenant()

        rest.postJson<Void>(
            "/api/entity-account/store",
            UpsertAccountDto(
                idTenant = idTenant, email = "a@fag.edu.br", login = "aluno",
                password = "senha", firstName = "A", lastName = "B",
            ),
        ).statusCode shouldBe HttpStatus.OK
        val idConta = jdbc.queryForObject("SELECT id FROM account WHERE login = 'aluno'", Long::class.java)!!

        permissoesDe(idConta) shouldContainExactlyInAnyOrder AuthPermissionsEnum.defaults().map { it.label }
    }

    @Test
    fun `quem tem MANAGE_PERMISSIONS substitui as permissões de outra conta`() {
        val idTenant = criarTenant()
        val idAdmin = criarConta(idTenant, "admin")
        val idAluno = criarConta(idTenant, "aluno")
        conceder(idAdmin, AuthPermissionsEnum.MANAGE_PERMISSIONS)
        conceder(idAluno, AuthPermissionsEnum.CREATE_PROJECT)

        val resposta = rest.postJson<Void>(
            definir,
            SetAccountPermissionsDto(idAdmin, idAluno, listOf(AuthPermissionsEnum.CREATE_TAG.id, AuthPermissionsEnum.EDIT_TAG.id), idProfiles = emptyList()),
        )

        resposta.statusCode shouldBe HttpStatus.OK
        permissoesDe(idAluno) shouldContainExactlyInAnyOrder listOf("CREATE_TAG", "EDIT_TAG")
    }

    @Test
    fun `sem MANAGE_PERMISSIONS a alteração é recusada e nada muda`() {
        val idTenant = criarTenant()
        val idAluno = criarConta(idTenant, "aluno")

        val resposta = rest.postJson<Void>(
            definir,
            SetAccountPermissionsDto(idAluno, idAluno, AuthPermissionsEnum.entries.map { it.id }, idProfiles = emptyList()),
        )

        resposta.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        permissoesDe(idAluno) shouldBe emptyList()
    }

    @Test
    fun `não dá para alterar contas de outro tenant`() {
        val idAdmin = criarConta(criarTenant("fag"), "admin")
        val idOutro = criarConta(criarTenant("outra"), "aluno")
        conceder(idAdmin, AuthPermissionsEnum.MANAGE_PERMISSIONS)

        val resposta = rest.postJson<Void>(
            definir,
            SetAccountPermissionsDto(idAdmin, idOutro, listOf(AuthPermissionsEnum.CREATE_TAG.id), idProfiles = emptyList()),
        )

        resposta.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        permissoesDe(idOutro) shouldBe emptyList()
    }

    @Test
    fun `ninguém tira de si mesmo a permissão de gerenciar permissões`() {
        val idTenant = criarTenant()
        val idAdmin = criarConta(idTenant, "admin")
        conceder(idAdmin, AuthPermissionsEnum.MANAGE_PERMISSIONS, AuthPermissionsEnum.CREATE_TAG)

        val resposta = rest.postJson<Void>(
            definir,
            SetAccountPermissionsDto(idAdmin, idAdmin, listOf(AuthPermissionsEnum.CREATE_TAG.id), idProfiles = emptyList()),
        )

        resposta.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        permissoesDe(idAdmin) shouldContainExactlyInAnyOrder listOf("MANAGE_PERMISSIONS", "CREATE_TAG")
    }

    @Test
    fun `apagar o tenant apaga as permissões das contas dele`() {
        val idTenant = criarTenant()
        conceder(criarConta(idTenant, "aluno"), AuthPermissionsEnum.CREATE_TAG)

        tenantSqlService.deleteTenant(idTenant)

        contarLinhas("account_permission_relationship") shouldBe 0
    }
}
