package br.com.synergia.rest

import br.com.synergia.config.autenticacao.SessaoService
import br.com.synergia.config.autenticacao.usuarioLogado
import br.com.synergia.libs.entityPermission.services.EntityPermissionService
import br.com.synergia.libs.utilsCommons.objects.NaoEncontradoException
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.tag.TagRepository
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

/**
 * Exclusões por id. Cada uma apaga só se o registro for da instituição da sessão,
 * e a instituição vai no próprio DELETE (`WHERE id = ? AND id_tenant = ?`): uma
 * consulta só, sem um SELECT de validação na frente. Registro de outra
 * instituição responde 404, igual a um que não existe.
 */
@RestController
@RequestMapping("/api/entity-delete-by-id")
class EntityDeleteByIdResource (
    private val tagRepository: TagRepository,
    private val accountRepository: AccountRepository,
    private val entityPermissionService: EntityPermissionService,
    private val sessoes: SessaoService,
) {
    /** Era GET: um link ou uma imagem bastava para apagar. Exclusão é DELETE. */
    @DeleteMapping("delete-tag-by-id/{id-tag}")
    fun deleteTagById(
        @PathVariable("id-tag") idTag: Long,
        request: HttpServletRequest,
    ): ResponseEntity<Void> {
        val idTenant = usuarioLogado(request).idTenant
        return ResponseMessenger.responseWithoutReturn {
            if (tagRepository.apagarDaInstituicao(idTag, idTenant) == 0) throw NaoEncontradoException()
        }
    }
    @DeleteMapping("/delete-account/{id-account}")
    fun deleteAccount(
        @PathVariable("id-account") idAccount: Long,
        request: HttpServletRequest,
    ): ResponseEntity<Void> {
        val idTenant = usuarioLogado(request).idTenant
        return ResponseMessenger.responseWithoutReturn {
            // Primeiro a conta (com a instituição no WHERE): se não for desta
            // instituição, nada mais é tocado.
            if (accountRepository.apagarDaInstituicao(idAccount, idTenant) == 0) throw NaoEncontradoException()
            entityPermissionService.revokeAllPermissions(idAccount)
            sessoes.encerrarDaConta(idAccount)
        }
    }
}
