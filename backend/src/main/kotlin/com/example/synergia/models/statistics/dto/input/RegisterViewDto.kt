package com.example.synergia.models.statistics.dto.input

import com.example.synergia.utils.enums.EntityRefEnum

data class RegisterViewDto(
    val idTenant: Long,
    val idAccount: Long,
    val idRef: Long,
    val entityRef: EntityRefEnum
)
