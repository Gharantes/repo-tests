package br.com.synergia.rest

import br.com.synergia.pageListTags.services.PageListTagsService
import br.com.synergia.utilsCommons.models.entities.TagDto
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/page-list-tags")
class PageListTagsResource (
    private val service: PageListTagsService
) {
    @PostMapping("/listar-tags")
    fun listarTags(
        @RequestParam("id-tenant") idTenant: Long,
        @RequestParam("text", required = false) text: String?
    ): ResponseEntity<List<TagDto>> {
        return ResponseMessenger.buildResponse { service.listarTags(idTenant, text) }
    }
}