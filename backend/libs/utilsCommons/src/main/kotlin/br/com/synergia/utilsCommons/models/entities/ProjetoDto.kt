package br.com.synergia.utilsCommons.models.entities

data class ProjetoDto (
    val id: Long,
    val title: String,
    val description: String,
    val tenant: TenantDto
)