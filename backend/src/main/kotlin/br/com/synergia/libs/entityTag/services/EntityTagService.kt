package br.com.synergia.libs.entityTag.services

import br.com.synergia.libs.entityTag.models.UpsertTagDto
import br.com.synergia.libs.utilsEntities.models.TagDto
import org.springframework.stereotype.Service

@Service
class EntityTagService (
    private val sqlService: EntityTagSqlService
) {
    fun listTagsByTenant(
        idTenant: Long,
        forProjects: Boolean,
        forEvents: Boolean,
        forAccounts: Boolean,
        text: String?
    ): List<TagDto> {
        return sqlService.listTags(
            idTenant,
            forProjects,
            forEvents,
            forAccounts,
            text
        )
    }
    fun listTagsByEvent(idEvent: Long, text: String?): List<TagDto> {
        return sqlService.listTagsByEvent(idEvent, text)
    }
    fun listTagsByProject(idProject: Long, text: String?): List<TagDto> {
        return sqlService.listTagsByProject(idProject, text)
    }
    fun listTagsByAccount(idAccount: Long, text: String?): List<TagDto> {
        return sqlService.listTagsByAccount(idAccount, text)
    }
    fun createTag(params: UpsertTagDto) {
        sqlService.createTag(params)
    }
    fun updateTag(idTag: Long, params: UpsertTagDto) {
        sqlService.updateTag(idTag, params)
    }
}