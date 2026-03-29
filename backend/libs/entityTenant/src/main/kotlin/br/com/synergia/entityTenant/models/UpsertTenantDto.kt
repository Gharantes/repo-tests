package br.com.synergia.entityTenant.models

data class UpsertTenantDto(
    val title: String,
    val identifier: String,
    val password: String,
    val isPrivate: Boolean
)