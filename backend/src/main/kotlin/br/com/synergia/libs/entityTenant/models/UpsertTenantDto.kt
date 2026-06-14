package br.com.synergia.libs.entityTenant.models

data class UpsertTenantDto(
    val title: String,
    val identifier: String,
    val password: String,
    val isPrivate: Boolean
)