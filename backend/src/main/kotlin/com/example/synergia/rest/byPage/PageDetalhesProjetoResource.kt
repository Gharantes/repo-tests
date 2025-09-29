package com.example.synergia.rest.byPage

import com.example.synergia.models.byPage.pageDetalhesProjeto.dto.output.ProjectDetailsDto
import com.example.synergia.services.byPage.PageDetalhesProjetoService
import com.example.synergia.utils.models.generics.GenericIdTextDto
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/detalhes-projeto")
class PageDetalhesProjetoResource (
    private val service: PageDetalhesProjetoService
) {
    @GetMapping("/get/{id}")
    fun getProjectDetailsDtoById(
        @PathVariable("id") id: Long
    ): ResponseEntity<ProjectDetailsDto> =
        ResponseMessenger.buildResponse { service.getProjectDetailsDtoById(id) }

    @GetMapping("/events-of-project/{id}")
    fun getEventsOfProject(
        @PathVariable("id") id: Long
    ): ResponseEntity<List<GenericIdTextDto>> =
        ResponseMessenger.buildResponse { service.getEventsOfProject(id) }

    @PostMapping("/add-event-to-project")
    fun addEventToProject(
        @RequestParam("id-project") idProject: Long,
        @RequestParam("id-event") idEvent: Long,
    ): ResponseEntity<Void> =
        ResponseMessenger.responseWithoutReturn { service.addEventToProject(idProject, idEvent) }

    @PostMapping("/remove-event-from-project")
    fun removeEventFromProject(
        @RequestParam("id-project") idProject: Long,
        @RequestParam("id-event") idEvent: Long,
    ): ResponseEntity<Void> =
        ResponseMessenger.responseWithoutReturn { service.removeEventFromProject(idProject, idEvent) }

    @GetMapping("/tags-of-project/{id}")
    fun getTagsOfProject(
        @PathVariable("id") id: Long
    ): ResponseEntity<List<GenericIdTextDto>> =
        ResponseMessenger.buildResponse { service.getTagsOfProject(id) }

    @PostMapping("/add-tag-to-project")
    fun addTagToProject(
        @RequestParam("id-project") idProject: Long,
        @RequestParam("id-tag") idTag: Long,
    ): ResponseEntity<Void> =
        ResponseMessenger.responseWithoutReturn { service.addTagToProject(idProject, idTag) }

    @PostMapping("/remove-tag-from-project")
    fun removeTagFromProject(
        @RequestParam("id-project") idProject: Long,
        @RequestParam("id-tag") idTag: Long,
    ): ResponseEntity<Void> =
        ResponseMessenger.responseWithoutReturn { service.removeTagFromProject(idProject, idTag) }
}