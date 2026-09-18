package br.com.synergia.libs.entityTenant.models

data class DeleteTenantDto(
    val idTenant: Long,
    /** Mesma senha da listagem de tenants (LIST_TENANT_PAGE_PASSWORD). */
    val password: String,
)
