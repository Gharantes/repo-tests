package br.com.synergia.rest

import br.com.synergia.libs.entityCalendar.models.UpsertCalendarEntryDto
import br.com.synergia.libs.entityCalendar.services.EntityCalendarService
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.CalendarEntryDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-calendar")
class EntityCalendarResource (
    private val service: EntityCalendarService
) {
    @PostMapping("/list-entries-of-project")
    fun listEntriesOfProject(
        @RequestParam("id-project") idProject: Long
    ): ResponseEntity<List<CalendarEntryDto>> {
        return ResponseMessenger.buildResponse {
            service.listEntriesOfProject(idProject)
        }
    }
    @PostMapping("/list-entries-of-event")
    fun listEntriesOfEvent(
        @RequestParam("id-event") idEvent: Long
    ): ResponseEntity<List<CalendarEntryDto>> {
        return ResponseMessenger.buildResponse {
            service.listEntriesOfEvent(idEvent)
        }
    }
    @PostMapping("store")
    fun createEntry(
        @RequestParam("parent-entity") parentEntity: NoteParentEnum,
        @RequestParam("parent-id") parentId: Long,
        @RequestBody params: UpsertCalendarEntryDto
    ): ResponseEntity<Long> {
        return ResponseMessenger.buildResponse {
            service.createEntry(parentEntity, parentId, params)
        }
    }
    @PostMapping("update/{id-entry}")
    fun updateEntry(
        @PathVariable("id-entry") idEntry: Long,
        @RequestBody params: UpsertCalendarEntryDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updateEntry(idEntry, params)
        }
    }
    @DeleteMapping("delete/{id-entry}")
    fun deleteEntry(
        @PathVariable("id-entry") idEntry: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.deleteEntry(idEntry, idAccount)
        }
    }
}
