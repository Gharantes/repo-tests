package br.com.synergia.pageUpsertTag.services

import br.com.synergia.pageUpsertTag.models.UpsertTagDto
import br.com.synergia.utilsEntities.jpa.tag.Tag
import br.com.synergia.utilsEntities.jpa.tag.TagRepository
import org.springframework.stereotype.Service

@Service
class PageUpsertTagSqlService (
    private val tagRepository: TagRepository
) {
    fun createTag(params: UpsertTagDto) {
        val tag = Tag(
            idTenant = params.idTenant,
            title = params.title,
            forEvents = params.forEvents,
            forAccounts = params.forAccounts,
            forProjects = params.forProjects
        )
        tagRepository.save(tag)
    }
    fun updateTag(idTag: Long, params: UpsertTagDto) {
        tagRepository.findById(idTag).ifPresent { tag ->
            tag.title = params.title
            tag.forAccounts = params.forAccounts
            tag.forEvents = params.forEvents
            tag.forProjects = params.forProjects
            tagRepository.save(tag)
        }
    }
}