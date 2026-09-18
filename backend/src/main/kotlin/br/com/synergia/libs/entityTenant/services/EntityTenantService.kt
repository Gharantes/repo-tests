package br.com.synergia.libs.entityTenant.services

import br.com.synergia.libs.entityTenant.models.UpsertTenantDto
import br.com.synergia.libs.utilsEntities.models.TenantDto
import org.springframework.beans.factory.annotation.Value
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class EntityTenantService (
    private val sqlService: EntityTenantSqlService,
    @Value("\${LIST_TENANT_PAGE_PASSWORD:}") private val listTenantPagePassword: String,
) {
    fun listAllTenants(text: String?): List<TenantDto> {
        return sqlService.listAllTenants(text)
    }
    /** Sem LIST_TENANT_PAGE_PASSWORD configurada, nenhuma senha é aceita. */
    fun checkListTenantsPassword(password: String): Boolean {
        return listTenantPagePassword.isNotEmpty() && password == listTenantPagePassword
    }
    fun getTenantByIdentifier(identifier: String): TenantDto? {
        return sqlService.getTenantByIdentifier(identifier)
    }
    @Transactional(rollbackFor = [Exception::class])
    fun createTenant(params: UpsertTenantDto) {
        validateIdentifier(params.identifier)
        val login = params.login.trim()
        if (login.isEmpty()) {
            throw Exception("Informe o login do administrador.")
        }
        if (getTenantByIdentifier(params.identifier) != null) {
            throw duplicateIdentifier(params.identifier)
        }
        // A consulta acima não cobre duas requisições simultâneas; a unique constraint é quem garante.
        try {
            sqlService.createTenant(params)
        } catch (e: DataIntegrityViolationException) {
            throw duplicateIdentifier(params.identifier)
        }

        val idTenant = getTenantByIdentifier(params.identifier)?.id ?: throw Exception("Erro ao criar Tenant.")
        sqlService.createAdminAccountForTenant(idTenant, login, params.password)
    }
    fun updateTenant(idTenant: Long, params: UpsertTenantDto) {
        validateIdentifier(params.identifier)
        sqlService.updateTenant(idTenant, params)
    }

    private fun duplicateIdentifier(identifier: String) =
        Exception("Já existe um tenant com esse mesmo identifier: $identifier")

    /** O identifier vira o primeiro segmento da URL do tenant no frontend (/<identifier>/login). */
    private fun validateIdentifier(identifier: String) {
        if (!IDENTIFIER_PATTERN.matches(identifier)) {
            throw Exception("Identifier inválido: use apenas letras minúsculas, números e hífen.")
        }
    }

    companion object {
        private val IDENTIFIER_PATTERN = Regex("^[a-z0-9]+(-[a-z0-9]+)*$")
    }
}
