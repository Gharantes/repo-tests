package br.com.synergia.integration

import br.com.synergia.integration.support.IntegrationTestBase
import br.com.synergia.integration.support.getForList
import br.com.synergia.integration.support.postForList
import br.com.synergia.integration.support.postJson
import br.com.synergia.integration.support.postSemCorpo
import br.com.synergia.libs.entityPermission.models.SetAccountPermissionsDto
import br.com.synergia.libs.entityPermission.models.UpsertPermissionProfileDto
import br.com.synergia.libs.utilsCommons.enums.AuthPermissionsEnum
import br.com.synergia.libs.utilsEntities.models.PermissionDto
import br.com.synergia.libs.utilsEntities.models.PermissionProfileDto
import io.kotest.matchers.collections.shouldBeEmpty
import io.kotest.matchers.collections.shouldContainExactlyInAnyOrder
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.DisplayName
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus

/**
 * Integração dos perfis de permissão: criar, editar e apagar perfis, atribuí-los a
 * contas e a regra de que ninguém tira de si mesmo, por perfil, o MANAGE_PERMISSIONS.
 */
@DisplayName("Integração: perfis de permissão")
class PermissionProfileIntegrationTest : IntegrationTestBase() {

    private val base = "/api/entity-permission"

    private fun permissoesDe(idConta: Long): List<String> =
        rest.getForList<PermissionDto>("$base/list-permissions-of-account?id-account=$idConta").body.shouldNotBeNull().map { it.name }

    private fun perfis(idTenant: Long): List<PermissionProfileDto> =
        rest.postForList<PermissionProfileDto>("$base/list-profiles?id-tenant=$idTenant").body.shouldNotBeNull()

    /** Uma conta que pode gerenciar permissões, pela permissão avulsa. */
    private fun criarGestor(idTenant: Long): Long {
        val id = criarConta(idTenant, "gestor")
        jdbc.update(
            "INSERT INTO account_permission_relationship (id_account, id_permission) VALUES (?, ?)",
            id, AuthPermissionsEnum.MANAGE_PERMISSIONS.id,
        )
        return id
    }

    private fun criarPerfil(idGestor: Long, idTenant: Long, nome: String, vararg p: AuthPermissionsEnum): Long =
        rest.postJson<Long>("$base/create-profile", UpsertPermissionProfileDto(idGestor, idTenant, nome, p.map { it.id }))
            .also { it.statusCode shouldBe HttpStatus.OK }
            .body.shouldNotBeNull()

    private fun atribuir(idGestor: Long, idConta: Long, perfis: List<Long>, avulsas: List<Long> = emptyList()) =
        rest.postJson<Void>("$base/set-account-permissions", SetAccountPermissionsDto(idGestor, idConta, avulsas, perfis))

    @Test
    fun `criar perfil grava o nome e as permissões`() {
        val idTenant = criarTenant()
        val idGestor = criarGestor(idTenant)

        criarPerfil(idGestor, idTenant, "  Aluno  ", AuthPermissionsEnum.CREATE_PROJECT, AuthPermissionsEnum.CREATE_EVENT)

        val perfil = perfis(idTenant).single()
        perfil.title shouldBe "Aluno"
        perfil.idPermissions shouldContainExactlyInAnyOrder listOf(AuthPermissionsEnum.CREATE_PROJECT.id, AuthPermissionsEnum.CREATE_EVENT.id)
        perfil.accountCount shouldBe 0
    }

    @Test
    fun `nome repetido no mesmo tenant é recusado, sem diferenciar maiúsculas`() {
        val idTenant = criarTenant()
        val idGestor = criarGestor(idTenant)
        criarPerfil(idGestor, idTenant, "Aluno")

        val resposta = rest.postJson<Long>("$base/create-profile", UpsertPermissionProfileDto(idGestor, idTenant, "aluno", emptyList()))

        resposta.statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        perfis(idTenant).size shouldBe 1
    }

    @Test
    fun `quem tem o perfil ganha as permissões dele, somadas às avulsas`() {
        val idTenant = criarTenant()
        val idGestor = criarGestor(idTenant)
        val idAluno = criarConta(idTenant, "aluno")
        val idPerfil = criarPerfil(idGestor, idTenant, "Aluno", AuthPermissionsEnum.CREATE_PROJECT)

        atribuir(idGestor, idAluno, listOf(idPerfil), avulsas = listOf(AuthPermissionsEnum.CREATE_TAG.id))
            .statusCode shouldBe HttpStatus.OK

        permissoesDe(idAluno) shouldContainExactlyInAnyOrder listOf("CREATE_PROJECT", "CREATE_TAG")
        perfis(idTenant).single().accountCount shouldBe 1
    }

    @Test
    fun `editar o perfil muda as permissões de todo mundo que o tem`() {
        val idTenant = criarTenant()
        val idGestor = criarGestor(idTenant)
        val idAluno = criarConta(idTenant, "aluno")
        val idPerfil = criarPerfil(idGestor, idTenant, "Aluno", AuthPermissionsEnum.CREATE_PROJECT)
        atribuir(idGestor, idAluno, listOf(idPerfil))

        rest.postJson<Void>(
            "$base/update-profile/$idPerfil",
            UpsertPermissionProfileDto(idGestor, idTenant, "Estudante", listOf(AuthPermissionsEnum.CREATE_EVENT.id)),
        ).statusCode shouldBe HttpStatus.OK

        permissoesDe(idAluno) shouldContainExactlyInAnyOrder listOf("CREATE_EVENT")
        perfis(idTenant).single().title shouldBe "Estudante"
    }

    @Test
    fun `apagar o perfil tira as permissões dele de quem o tinha`() {
        val idTenant = criarTenant()
        val idGestor = criarGestor(idTenant)
        val idAluno = criarConta(idTenant, "aluno")
        val idPerfil = criarPerfil(idGestor, idTenant, "Aluno", AuthPermissionsEnum.CREATE_PROJECT)
        atribuir(idGestor, idAluno, listOf(idPerfil))

        rest.postSemCorpo<Void>("$base/delete-profile/$idPerfil?id-requester=$idGestor").statusCode shouldBe HttpStatus.OK

        permissoesDe(idAluno).shouldBeEmpty()
        contarLinhas("account_permission_profile_relationship") shouldBe 0
    }

    @Test
    fun `não dá para atribuir perfil de outro tenant`() {
        val idTenant = criarTenant("fag")
        val idOutroTenant = criarTenant("outra")
        val idGestor = criarGestor(idTenant)
        val idGestorOutro = criarConta(idOutroTenant, "gestor2")
        jdbc.update("INSERT INTO account_permission_relationship (id_account, id_permission) VALUES (?, ?)", idGestorOutro, AuthPermissionsEnum.MANAGE_PERMISSIONS.id)
        val idPerfilAlheio = criarPerfil(idGestorOutro, idOutroTenant, "Alheio", AuthPermissionsEnum.CREATE_TAG)
        val idAluno = criarConta(idTenant, "aluno")

        atribuir(idGestor, idAluno, listOf(idPerfilAlheio)).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        permissoesDe(idAluno).shouldBeEmpty()
    }

    @Test
    fun `quem gerencia só pelo perfil não pode tirar MANAGE_PERMISSIONS do próprio perfil nem apagá-lo`() {
        val idTenant = criarTenant()
        val idGestor = criarGestor(idTenant)
        val idPerfil = criarPerfil(idGestor, idTenant, "Admin", AuthPermissionsEnum.MANAGE_PERMISSIONS)
        // Passa a gerenciar só pelo perfil.
        atribuir(idGestor, idGestor, listOf(idPerfil)).statusCode shouldBe HttpStatus.OK

        rest.postJson<Void>(
            "$base/update-profile/$idPerfil",
            UpsertPermissionProfileDto(idGestor, idTenant, "Admin", emptyList()),
        ).statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR
        rest.postSemCorpo<Void>("$base/delete-profile/$idPerfil?id-requester=$idGestor")
            .statusCode shouldBe HttpStatus.INTERNAL_SERVER_ERROR

        permissoesDe(idGestor) shouldContainExactlyInAnyOrder listOf("MANAGE_PERMISSIONS")
        perfis(idTenant).single().idPermissions shouldBe listOf(AuthPermissionsEnum.MANAGE_PERMISSIONS.id)
    }

    @Test
    fun `o admin de tenant novo fica com o perfil Administrador`() {
        rest.postJson<Void>(
            "/api/entity-tenant/store",
            br.com.synergia.libs.entityTenant.models.UpsertTenantDto(title = "FAG", identifier = "fag", login = "ADMIN", password = "SenhaForte1"),
        ).statusCode shouldBe HttpStatus.OK
        val idTenant = jdbc.queryForObject("SELECT id FROM tenant WHERE identifier = 'fag'", Long::class.java)!!
        val idAdmin = jdbc.queryForObject("SELECT id FROM account WHERE login = 'ADMIN'", Long::class.java)!!

        val perfil = perfis(idTenant).single()
        perfil.title shouldBe "Administrador"
        perfil.accountCount shouldBe 1
        permissoesDe(idAdmin) shouldContainExactlyInAnyOrder AuthPermissionsEnum.entries.map { it.label }
    }

    @Test
    fun `apagar o tenant apaga os perfis dele`() {
        val idTenant = criarTenant()
        val idGestor = criarGestor(idTenant)
        atribuir(idGestor, idGestor, listOf(criarPerfil(idGestor, idTenant, "Admin", AuthPermissionsEnum.MANAGE_PERMISSIONS)))

        tenantSqlService.deleteTenant(idTenant)

        contarLinhas("permission_profile") shouldBe 0
        contarLinhas("permission_profile_permission_relationship") shouldBe 0
        contarLinhas("account_permission_profile_relationship") shouldBe 0
    }
}
