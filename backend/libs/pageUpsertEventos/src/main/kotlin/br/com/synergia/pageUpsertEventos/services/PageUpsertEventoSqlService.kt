package br.com.synergia.pageUpsertEventos.services

import br.com.synergia.pageUpsertEventos.models.CreateEventoDto
import br.com.synergia.pageUpsertEventos.models.UpdateEventoDto
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageUpsertEventoSqlService (
    private val template: NamedParameterJdbcTemplate,
//    private val eventRepository: EventRepository,
//    private val attachmentsRepository: AttachmentsRepository,
//    private val eventTagRelationshipService: EventTagRelationshipService
) {

    fun getCreateEventoDtoById(id: Long): CreateEventoDto? {
        val sql = SqlPath.PageUpsertEvento.GET_CREATE_EVENTO_DTO_BY_ID.load()
        val paramMap = MapSqlParameterSource().addValue("id", id, Types.BIGINT)
        return template.query(sql, paramMap) { rs, _ ->
            CreateEventoDto(
                idTenant = rs.getLong("id_tenant"),
                idAccount = rs.getLong("created_by"),
                title = rs.getString("title"),
                description = rs.getString("description"),
                urlBanner = rs.getString("url_banner"),
                tags = emptyList()
            )
        }.firstOrNull()
    }

    fun createEvento(params: CreateEventoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }
        val sql = SqlPath.PageUpsertEvento.INSERT_EVENTO.load()
        val paramMap = MapSqlParameterSource()
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("description", params.description, Types.VARCHAR)
            .addValue("created_by", params.idAccount, Types.BIGINT)
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
        template.update(sql, paramMap)
//        updateBanner(eventEntity.id!!, params.urlBanner, eventEntity)
//        eventTagRelationshipService.updateTags(eventEntity.id!!, params.tags)
    }

    fun updateEvento(params: UpdateEventoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }
        val sql = SqlPath.PageUpsertEvento.UPDATE_EVENTO.load()
        val paramMap = MapSqlParameterSource()
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("description", params.description, Types.VARCHAR)
        template.update(sql, paramMap)
//        updateBanner(params.id, params.urlBanner, eventEntity)
//        eventTagRelationshipService.updateTags(params.id, params.tags)
    }

//    private fun updateBanner(idEvent: Long, url: String?, eventEntity: EventEntity) {
//        val oldIdBanner = eventRepository.findById(idEvent).getOrNull()?.idBanner
//
//        if (url.isNullOrBlank() && oldIdBanner == null) {
//            return
//        } else if (url.isNullOrBlank() && oldIdBanner != null) {
//            attachmentsRepository.deleteById(oldIdBanner)
//            return
//        } else if (!url.isNullOrBlank() && oldIdBanner == null) {
//            var attachmentEntity = AttachmentsEntity()
//            attachmentEntity.url = url
//            attachmentEntity.attachmentType = AttachmentTypeEnum.IMAGE
//            attachmentEntity.idTenant = eventEntity.idTenant
//            attachmentEntity = attachmentsRepository.save(attachmentEntity)
//            eventEntity.idBanner = attachmentEntity.id
//            eventRepository.save(eventEntity)
//            return
//        } else if (!url.isNullOrBlank() && oldIdBanner != null) {
//            val attachmentEntity = attachmentsRepository.findById(oldIdBanner).get()
//            if (attachmentEntity.url == url) { return }
//            attachmentEntity.url = url
//            attachmentsRepository.save(attachmentEntity)
//            return
//        }
//    }
}