package br.com.synergia.rest

import br.com.synergia.libs.entityNote.models.UpsertNoteDto
import br.com.synergia.libs.entityNote.services.EntityNoteService
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsCommons.objects.ResponseMessenger
import br.com.synergia.libs.utilsEntities.models.NoteDto
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/entity-note")
class EntityNoteResource (
    private val service: EntityNoteService
) {
    @PostMapping("/list-notes-by-account")
    fun listNotesByAccount(
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<List<NoteDto>> {
        return ResponseMessenger.buildResponse {
            service.listNotesByAccount(idAccount)
        }
    }
    @PostMapping("/list-notes-of-project")
    fun listNotesOfProject(
        @RequestParam("id-project") idProject: Long
    ): ResponseEntity<List<NoteDto>> {
        return ResponseMessenger.buildResponse {
            service.listNotesOfProject(idProject)
        }
    }
    @PostMapping("/list-notes-of-event")
    fun listNotesOfEvent(
        @RequestParam("id-event") idEvent: Long
    ): ResponseEntity<List<NoteDto>> {
        return ResponseMessenger.buildResponse {
            service.listNotesOfEvent(idEvent)
        }
    }
    @PostMapping("store")
    fun createNote(
        @RequestBody params: UpsertNoteDto
    ): ResponseEntity<Long> {
        return ResponseMessenger.buildResponse {
            service.createNote(params)
        }
    }
    @PostMapping("update/{id-note}")
    fun updateNote(
        @PathVariable("id-note") idNote: Long,
        @RequestBody params: UpsertNoteDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updateNote(idNote, params)
        }
    }
    @PostMapping("attach/{id-note}")
    fun attachNote(
        @PathVariable("id-note") idNote: Long,
        @RequestParam("id-account") idAccount: Long,
        @RequestParam("parent-entity", required = false) parentEntity: NoteParentEnum? = null,
        @RequestParam("parent-id", required = false) parentId: Long? = null
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.attachNote(idNote, idAccount, parentEntity, parentId)
        }
    }
    @DeleteMapping("delete/{id-note}")
    fun deleteNote(
        @PathVariable("id-note") idNote: Long,
        @RequestParam("id-account") idAccount: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.deleteNote(idNote, idAccount)
        }
    }
}
