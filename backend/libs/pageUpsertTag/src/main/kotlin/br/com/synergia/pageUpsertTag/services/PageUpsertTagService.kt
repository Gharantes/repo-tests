package br.com.synergia.pageUpsertTag.services

import br.com.synergia.pageUpsertTag.models.UpsertTagDto
import org.springframework.stereotype.Service

@Service
class PageUpsertTagService (
    private val sqlService: PageUpsertTagSqlService
) {
    fun createTag(params: UpsertTagDto) {
        sqlService.createTag(params)
    }
    fun updateTag(idTag: Long, params: UpsertTagDto) {
        sqlService.updateTag(idTag, params)
    }
}