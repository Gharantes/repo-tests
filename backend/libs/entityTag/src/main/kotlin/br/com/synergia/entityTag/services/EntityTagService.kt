package br.com.synergia.entityTag.services

import br.com.synergia.entityTag.models.UpsertTagDto
import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.stereotype.Service

@Service
class EntityTagService (
    private val sqlService: EntityTagSqlService
) {
    fun listTagsByTenant(idTenant: Long, text: String?): List<TagDto> {
        return sqlService.listTags(idTenant, text)
    }
    fun listTagsByEvent(idEvent: Long, text: String?): List<TagDto> {
        return sqlService.listTagsByEvent(idEvent, text)
    }
    fun listTagsByProject(idProject: Long, text: String?): List<TagDto> {
        return sqlService.listTagsByProject(idProject, text)
    }
    fun createTag(params: UpsertTagDto) {
        sqlService.createTag(params)
    }
    fun updateTag(idTag: Long, params: UpsertTagDto) {
        sqlService.updateTag(idTag, params)
    }
}