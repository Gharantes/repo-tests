package br.com.synergia.rest

import br.com.synergia.config.autenticacao.SessaoService
import br.com.synergia.config.autenticacao.usuarioLogado
import br.com.synergia.config.limite.ProtecaoSenhaInstituicoes
import jakarta.servlet.http.HttpServletRequest
import br.com.synergia.libs.entityTenant.models.CheckListTenantsPasswordDto
import br.com.synergia.libs.entityTenant.models.DeleteTenantDto
import br.com.synergia.libs.entityTenant.models.UpsertTenantDto
import br.com.synergia.libs.entityTenant.services.EntityTenantService
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.TenantDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-tenant")
class EntityTenantResource (
    private val service: EntityTenantService,
    private val protecaoSenha: ProtecaoSenhaInstituicoes,
    private val sessoes: SessaoService,
) {
    @PostMapping("/list-all-tenants")
    fun listAllTenants(
        @RequestParam("text", required = false) text: String? = null
    ): ResponseEntity<List<TenantDto>> {
        return ResponseMessenger.buildResponse {
            service.listAllTenants(text)
        }
    }
    @PostMapping("check-list-tenants-password")
    fun checkListTenantsPassword(
        @RequestBody params: CheckListTenantsPasswordDto,
        request: HttpServletRequest,
    ): ResponseEntity<Boolean> {
        val ip = request.remoteAddr ?: "desconhecido"
        protecaoSenha.barrar<Boolean>(ip)?.let { return it }

        val resposta = ResponseMessenger.buildResponse {
            service.checkListTenantsPassword(params.password)
        }
        if (resposta.body == true) protecaoSenha.registrarSucesso(ip) else protecaoSenha.registrarFalha(ip)
        return resposta
    }
    @PostMapping("delete")
    fun deleteTenant(
        @RequestBody params: DeleteTenantDto,
        request: HttpServletRequest,
    ): ResponseEntity<Void> {
        // Usa a mesma senha da página de instituições: sem o limite aqui, o robô
        // trocaria de rota para continuar chutando.
        val ip = request.remoteAddr ?: "desconhecido"
        protecaoSenha.barrar<Void>(ip)?.let { return it }

        if (!service.checkListTenantsPassword(params.password)) {
            protecaoSenha.registrarFalha(ip)
        }
        return ResponseMessenger.responseWithoutReturn {
            service.deleteTenant(params.idTenant, params.password)
            // O SQL de exclusão já apagou as sessões; isto tira do cache as que ainda estavam lá.
            sessoes.esquecerDaInstituicao(params.idTenant)
        }
    }
    @PostMapping("store")
    fun createTenant(
        @RequestBody params: UpsertTenantDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.createTenant(params)
        }
    }
    @PostMapping("update/{id-tenant}")
    fun updateTenant(
        @PathVariable("id-tenant") idTenant: Long,
        @RequestBody params: UpsertTenantDto,
        request: HttpServletRequest,
    ): ResponseEntity<Void> {
        val idTenantDaSessao = usuarioLogado(request).idTenant
        return ResponseMessenger.responseWithoutReturn {
            service.updateTenant(idTenant, params, idTenantDaSessao)
        }
    }
}