package com.example.synergia.services

import com.example.synergia.repositories.attachments.DeleteAttachmentSql
import com.example.synergia.repositories.attachments.GetIdBannerProject
import com.example.synergia.repositories.attachments.InsertAttachmentSql
import com.example.synergia.repositories.attachments.UpdateAttachmentUrlSql
import com.example.synergia.repositories.pageCreateProjeto.CreateProjetoSql
import com.example.synergia.repositories.pageCreateProjeto.GetCreateProjetoDtoByIdSql
import com.example.synergia.repositories.pageCreateProjeto.UpdateProjetoSql
import com.example.synergia.rest.pageCreateProjeto.dto.input.CreateProjetoDto
import com.example.synergia.rest.pageCreateProjeto.dto.input.UpdateProjetoDto
import com.example.synergia.utils.enums.AttachmentTypeEnum
import com.example.synergia.utils.models.attachments.InsertAttachmentDto
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageCreateProjetoService (
    private val template: NamedParameterJdbcTemplate
) {

    fun getCreateProjetoDtoById(id: Long): CreateProjetoDto? = GetCreateProjetoDtoByIdSql(id).queryForObject(template)

    fun createProjeto(params: CreateProjetoDto) {
        require(params.title.isNotBlank()) { "Titúlo não pode estar vazio." }
        val idBanner = InsertAttachmentSql
            .ofImage(params.idTenant, params.urlBanner)
            ?.executeStatementWithReturnKey(template, "id")
            ?.toLong()

        CreateProjetoSql(params, idBanner).executeStatement(template)
    }

    fun updateProjeto(params: UpdateProjetoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }
        val oldIdBanner = GetIdBannerProject(params.id).queryForObject(template)
        val oldUrlBanner = getCreateProjetoDtoById(params.id)?.urlBanner

        val newIdBanner = if (oldUrlBanner == null && params.urlBanner != null) {
            InsertAttachmentSql.ofImage(params.idTenant, params.urlBanner)?.returnId(template)
        } else null

        UpdateProjetoSql(params, newIdBanner).executeStatement(template)

        if (!oldUrlBanner.isNullOrBlank() && !params.urlBanner.isNullOrBlank() && oldUrlBanner != params.urlBanner) {
            UpdateAttachmentUrlSql(requireNotNull(oldIdBanner), params.urlBanner).executeStatement(template)
        } else if (!oldUrlBanner.isNullOrBlank() && params.urlBanner.isNullOrBlank()) {
            DeleteAttachmentSql(requireNotNull(oldIdBanner)).executeStatement(template)
        }
    }
}