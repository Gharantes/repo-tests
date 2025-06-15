package com.example.synergia.services

import com.example.synergia.domain.AttachmentsEntity
import com.example.synergia.domain.EventEntity
import com.example.synergia.domainRepositories.AttachmentsRepository
import com.example.synergia.domainRepositories.EventRepository
import com.example.synergia.pageRepositories.pageCreateEvento.GetCreateEventoDtoByIdSql
import com.example.synergia.rest.pageCreateEvento.dto.input.CreateEventoDto
import com.example.synergia.rest.pageCreateEvento.dto.input.UpdateEventoDto
import com.example.synergia.utils.enums.AttachmentTypeEnum
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import kotlin.jvm.optionals.getOrNull

@Service
class PageCreateEventoService (
    private val template: NamedParameterJdbcTemplate,
    private val eventRepository: EventRepository,
    private val attachmentsRepository: AttachmentsRepository
) {

    fun getCreateEventoDtoById(id: Long): CreateEventoDto? = GetCreateEventoDtoByIdSql(id).queryForObject(template)

    fun createEvento(params: CreateEventoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }

        var eventEntity = EventEntity()
        eventEntity.title = params.title
        eventEntity.description = params.description
        eventEntity.createdBy = params.idAccount
        eventEntity.idTenant = params.idTenant
        eventEntity = eventRepository.save(eventEntity)

        updateBanner(eventEntity.id!!, params.urlBanner, eventEntity)
    }

    fun updateEvento(params: UpdateEventoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }

        var eventEntity = eventRepository.findById(params.id).get()
        eventEntity.title = params.title
        eventEntity.description = params.description
        eventEntity = eventRepository.save(eventEntity)

        updateBanner(params.id, params.urlBanner, eventEntity)
    }

    private fun updateBanner(idEvent: Long, url: String?, eventEntity: EventEntity) {
        val oldIdBanner = eventRepository.findById(idEvent).getOrNull()?.idBanner

        if (url.isNullOrBlank() && oldIdBanner == null) {
            return
        } else if (url.isNullOrBlank() && oldIdBanner != null) {
            attachmentsRepository.deleteById(oldIdBanner)
            return
        } else if (!url.isNullOrBlank() && oldIdBanner == null) {
            var attachmentEntity = AttachmentsEntity()
            attachmentEntity.url = url
            attachmentEntity.attachmentType = AttachmentTypeEnum.IMAGE
            attachmentEntity.idTenant = eventEntity.idTenant
            attachmentEntity = attachmentsRepository.save(attachmentEntity)
            eventEntity.idBanner = attachmentEntity.id
            eventRepository.save(eventEntity)
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