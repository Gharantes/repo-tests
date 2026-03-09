package br.com.synergia.rest

import br.com.synergia.pageExtendedEvent.services.PageExtendedEventService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import br.com.synergia.utilsEntities.models.EventDto
import br.com.synergia.utilsEntities.models.ProjectDto
import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/page-extended-event")
class PageExtendedEventResource (
    private val service: PageExtendedEventService
) {
    @PostMapping("/list-projects-of-event/{id-event}")
    fun listProjectsOfEvent(
        @PathVariable("id-event") idEvent: Long
    ): ResponseEntity<List<ProjectDto>> {
        return ResponseMessenger.buildResponse {
            service.listProjectsOfEvent(idEvent)
        }
    }

    @PostMapping("/list-tags-of-event/{id-event}")
    fun listTagsOfEvent(
        @PathVariable("id-event") idEvent: Long
    ): ResponseEntity<List<TagDto>> {
        return ResponseMessenger.buildResponse {
            service.listTagsOfEvent(idEvent)
        }
    }

    @PostMapping("/get-detailed-event-by-id/{id-event}")
    fun getDetailedEventById(
        @PathVariable("id-event") idEvent: Long
    ): ResponseEntity<EventDto?> {
        return ResponseMessenger.buildResponse {
            service.getDetailedEventById(idEvent)
        }
    }
}