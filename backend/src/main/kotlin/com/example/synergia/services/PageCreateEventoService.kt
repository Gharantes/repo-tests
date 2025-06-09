package com.example.synergia.services

import com.example.synergia.repositories.attachments.DeleteAttachmentSql
import com.example.synergia.repositories.attachments.GetIdBannerEvento
import com.example.synergia.repositories.attachments.GetIdBannerProject
import com.example.synergia.repositories.attachments.InsertAttachmentSql
import com.example.synergia.repositories.attachments.UpdateAttachmentUrlSql
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

    fun getCreateEventoDtoById(id: Long): CreateEventoDto? = GetCreateEventoDtoByIdSql(id).queryForObject(template)

    fun createEvento(params: CreateEventoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }
        val idBanner = InsertAttachmentSql
            .ofImage(params.idTenant, params.urlBanner)
            ?.executeStatementWithReturnKey(template, "id"
            )?.toLong()

        CreateEventoSql(params, idBanner).executeStatement(template)
    }

    fun updateEvento(params: UpdateEventoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }
        val oldIdBanner = GetIdBannerEvento(params.id).queryForObject(template)
        val oldUrlBanner = getCreateEventoDtoById(params.id)?.urlBanner

        val newIdBanner = if (oldUrlBanner == null && params.urlBanner != null) {
            InsertAttachmentSql.ofImage(params.idTenant, params.urlBanner)?.returnId(template)
        } else null

        UpdateEventoSql(params, newIdBanner).executeStatement(template)

        if (!oldUrlBanner.isNullOrBlank() && !params.urlBanner.isNullOrBlank() && oldUrlBanner != params.urlBanner) {
            UpdateAttachmentUrlSql(requireNotNull(oldIdBanner), params.urlBanner).executeStatement(template)
        } else if (!oldUrlBanner.isNullOrBlank() && params.urlBanner.isNullOrBlank()) {
            DeleteAttachmentSql(requireNotNull(oldIdBanner)).executeStatement(template)
        }
    }
}