package com.example.synergia.rest.pageListarTags

import com.example.synergia.rest.pageListarProjetos.dto.input.FiltroListarProjetosAllDto
import com.example.synergia.rest.pageListarProjetos.dto.output.ListarProjetosBasicInfoDto
import com.example.synergia.rest.pageListarTags.dto.input.FiltroListarTagsAllDto
import com.example.synergia.rest.pageListarTags.dto.input.InsertTagDto
import com.example.synergia.rest.pageListarTags.dto.output.ListarTagDto
import com.example.synergia.services.PageListarTagsService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/listar-tags")
class PageListarTagsResource (
    private val service: PageListarTagsService
) {
    @PostMapping("/all")
    fun listarTagsAll(
        @RequestBody params: FiltroListarTagsAllDto
    ): ResponseEntity<List<ListarTagDto>> =
        ResponseMessenger.buildResponse { service.listarTagsAll(params) }

    @PostMapping("/insert")
    fun insertTag(
        @RequestBody params: InsertTagDto
    ): ResponseEntity<Unit> =
        ResponseMessenger.buildResponse { service.insertTag(params) }

    @DeleteMapping("/delete/{id}")
    fun deleteTag(@PathVariable("id") id: Long): ResponseEntity<Unit> =
        ResponseMessenger.buildResponse { service.deleteTag(id) }
}