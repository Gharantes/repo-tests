package com.example.synergia.services

import com.example.synergia.repositories.attachments.InsertAttachmentSql
import com.example.synergia.repositories.pageCreateEvento.CreateEventoSql
import com.example.synergia.repositories.pageCreateEvento.GetCreateEventoDtoByIdSql
import com.example.synergia.repositories.pageCreateEvento.UpdateEventoSql
import com.example.synergia.rest.pageCreateEvento.dto.input.CreateEventoDto
import com.example.synergia.rest.pageCreateEvento.dto.input.UpdateEventoDto
import com.example.synergia.utils.enums.AttachmentTypeEnum
import com.example.synergia.utils.models.attachments.InsertAttachmentDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageCreateEventoService (
    private val template: NamedParameterJdbcTemplate
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

    fun getCreateEventoDtoById(id: Long): CreateEventoDto? =
        GetCreateEventoDtoByIdSql(id).queryForObject(template)

    fun updateEvento(params: UpdateEventoDto) {
        UpdateEventoSql(params).executeStatement(template)
    }
}