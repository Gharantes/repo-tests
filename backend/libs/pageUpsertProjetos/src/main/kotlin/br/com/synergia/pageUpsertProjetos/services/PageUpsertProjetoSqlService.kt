package br.com.synergia.pageUpsertProjetos.services

import br.com.synergia.pageUpsertProjetos.models.CreateProjetoDto
import br.com.synergia.pageUpsertProjetos.models.UpdateProjetoDto
import br.com.synergia.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class PageUpsertProjetoSqlService (
    private val template: NamedParameterJdbcTemplate
) {

    fun getCreateProjetoDtoById(id: Long): CreateProjetoDto? {
        val sql = SqlPath.PageUpsertProjeto.GET_CREATE_EVENTO_DTO_BY_ID.load()
        val paramMap = MapSqlParameterSource().addValue("id", id, Types.BIGINT)
        return template.query(sql, paramMap) { rs, _ ->
            CreateProjetoDto(
                idTenant = rs.getLong("id_tenant"),
                title = rs.getString("title"),
                description = rs.getString("description"),
                idAccount = rs.getLong("created_by"),
                urlBanner = rs.getString("url_banner"),
                tags = emptyList()
            )
        }.firstOrNull()
    }

    fun createProjeto(params: CreateProjetoDto) {
        require(params.title.isNotBlank()) { "Titúlo não pode estar vazio." }
        val sql = SqlPath.PageUpsertProjeto.INSERT_PROJETO.load()
        val paramMap = MapSqlParameterSource()
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("id_tenant", params.idTenant, Types.BIGINT)
            .addValue("description", params.title, Types.VARCHAR)
            .addValue("created_by", params.idAccount, Types.BIGINT)
        template.update(sql, paramMap)
//        updateBanner(projectEntity.id!!, params.urlBanner, projectEntity)
//        projectTagRelationshipService.updateTags(projectEntity.id!!, params.tags)
    }

    fun updateProjeto(params: UpdateProjetoDto) {
        require(params.title.isNotBlank()) { "Título não pode estar vazio." }
        val sql = SqlPath.PageUpsertProjeto.UPDATE_PROJETO.load()
        val paramMap = MapSqlParameterSource()
            .addValue("title", params.title, Types.VARCHAR)
            .addValue("description", params.description, Types.VARCHAR)
        template.update(sql, paramMap)
//        updateBanner(params.id, params.urlBanner, projectEntity)
//        projectTagRelationshipService.updateTags(params.id, params.tags)
    }

//    private fun updateBanner(idEvent: Long, url: String?, projectEntity: ProjectEntity) {
//        val oldIdBanner = projectRepository.findById(idEvent).getOrNull()?.idBanner
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
//            attachmentEntity.idTenant = projectEntity.idTenant
//            attachmentEntity = attachmentsRepository.save(attachmentEntity)
//            projectEntity.idBanner = attachmentEntity.id
//            projectRepository.save(projectEntity)
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