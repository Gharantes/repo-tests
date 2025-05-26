package com.example.synergia.utils.models.attachments

import com.example.synergia.utils.enums.AttachmentTypeEnum

data class InsertAttachmentDto(
    val idTenant: Long,
    val type: AttachmentTypeEnum,
    val url: String
)
