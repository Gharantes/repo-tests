package br.com.synergia.pageListTags.services

import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.stereotype.Service

@Service
class PageListTagsService (
    private val sqlService: PageListTagsSqlService
) {
    fun listTags(idTenant: Long, text: String?): List<TagDto> {
        return sqlService.listTags(idTenant, text)
    }
}