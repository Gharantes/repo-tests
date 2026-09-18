package br.com.synergia.libs.entityTenant.models

data class UpsertTenantDto(
    val title: String,
    val identifier: String,
    /** Login da primeira conta do tenant. Ignorado na atualização. */
    val login: String,
    val password: String,
)