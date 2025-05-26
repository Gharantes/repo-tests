package com.example.synergia.services

import com.example.synergia.repositories.attachments.InsertAttachmentSql
import com.example.synergia.repositories.pageCreateEvento.CreateEventoSql
import com.example.synergia.rest.pageCreateEvento.dto.input.CreateEventoDto
import com.example.synergia.utils.enums.AttachmentTypeEnum
import com.example.synergia.utils.models.attachments.InsertAttachmentDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageCreateEventoService (
    private val template: JdbcTemplate
) {
    fun createEvento(params: CreateEventoDto) {
        val idBanner = if (!params.urlBanner.isNullOrBlank()) {
            InsertAttachmentSql(InsertAttachmentDto(
                idTenant = params.idTenant,
                type = AttachmentTypeEnum.IMAGE,
                url = params.urlBanner
            )).executeStatementWithReturnKey(template, "id")?.toLong()
        } else null

        CreateEventoSql(
            params,
            idBanner
        ).executeStatement(template)
    }
}