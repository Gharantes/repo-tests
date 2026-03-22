package br.com.synergia.rest

import br.com.synergia.pageUpsertTag.models.UpsertTagDto
import br.com.synergia.pageUpsertTag.services.PageUpsertTagService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/page-upsert-tag")
class PageUpsertTagResource (
    private val service: PageUpsertTagService
) {
    @PostMapping("/create-tag")
    fun createTag(
        @RequestBody params: UpsertTagDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.createTag(params) }
    }
    @PostMapping("/update-tag/{id-tag}")
    fun updateTag(
        @PathVariable("id-tag") idTag: Long,
        @RequestBody params: UpsertTagDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn { service.updateTag(idTag, params) }
    }
}