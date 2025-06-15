package com.example.synergia.services

import com.example.synergia.domain.AttachmentsEntity
import com.example.synergia.domain.EventEntity
import com.example.synergia.domain.ProjectEntity
import com.example.synergia.domainRepositories.AttachmentsRepository
import com.example.synergia.domainRepositories.ProjectRepository
import com.example.synergia.pageRepositories.pageCreateProjeto.GetCreateProjetoDtoByIdSql
import com.example.synergia.rest.pageCreateProjeto.dto.input.CreateProjetoDto
import com.example.synergia.rest.pageCreateProjeto.dto.input.UpdateProjetoDto
import com.example.synergia.utils.enums.AttachmentTypeEnum
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull

@Service
class PageCreateProjetoService (
    private val template: NamedParameterJdbcTemplate,
    private val projectRepository: ProjectRepository,
    private val attachmentsRepository: AttachmentsRepository
) {

    fun getCreateProjetoDtoById(id: Long): CreateProjetoDto? = GetCreateProjetoDtoByIdSql(id).queryForObject(template)

    fun createProjeto(params: CreateProjetoDto) {
        require(params.title.isNotBlank()) { "Titúlo não pode estar vazio." }

        var projectEntity = ProjectEntity()
        projectEntity.idTenant = params.idTenant
        projectEntity.title = params.title
        projectEntity.description = params.description
        projectEntity.createdBy = params.idAccount
        projectEntity = projectRepository.save(projectEntity)

        updateBanner(projectEntity.id!!, params.urlBanner, projectEntity)
    }

    fun updateProjeto(params: UpdateProjetoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }

        var projectEntity = projectRepository.findById(params.id).get()
        projectEntity.title = params.title
        projectEntity.description = params.description
        projectEntity = projectRepository.save(projectEntity)

        updateBanner(params.id, params.urlBanner, projectEntity)
    }

    private fun updateBanner(idEvent: Long, url: String?, projectEntity: ProjectEntity) {
        val oldIdBanner = projectRepository.findById(idEvent).getOrNull()?.idBanner

        if (url.isNullOrBlank() && oldIdBanner == null) {
            return
        } else if (url.isNullOrBlank() && oldIdBanner != null) {
            attachmentsRepository.deleteById(oldIdBanner)
            return
        } else if (!url.isNullOrBlank() && oldIdBanner == null) {
            var attachmentEntity = AttachmentsEntity()
            attachmentEntity.url = url
            attachmentEntity.attachmentType = AttachmentTypeEnum.IMAGE
            attachmentEntity.idTenant = projectEntity.idTenant
            attachmentEntity = attachmentsRepository.save(attachmentEntity)
            projectEntity.idBanner = attachmentEntity.id
            projectRepository.save(projectEntity)
            return
        } else if (!url.isNullOrBlank() && oldIdBanner != null) {
            val attachmentEntity = attachmentsRepository.findById(oldIdBanner).get()
            if (attachmentEntity.url == url) { return }
            attachmentEntity.url = url
            attachmentsRepository.save(attachmentEntity)
            return
        }
    }
}