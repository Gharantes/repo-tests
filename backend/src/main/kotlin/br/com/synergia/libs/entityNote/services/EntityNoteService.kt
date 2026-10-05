package br.com.synergia.libs.entityNote.services

import br.com.synergia.libs.entityNote.models.UpsertNoteDto
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.jpa.note.Note
import br.com.synergia.libs.utilsEntities.models.NoteDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class EntityNoteService (
    private val sqlService: EntityNoteSqlService,
) {
    fun listNotesByAccount(idAccount: Long): List<NoteDto> {
        return sqlService.listNotes(idAccount = idAccount, includeArchived = true)
    }
    fun listNotesOfProject(idProject: Long): List<NoteDto> {
        return sqlService.listNotes(idProject = idProject, includeArchived = false)
    }
    fun listNotesOfEvent(idEvent: Long): List<NoteDto> {
        return sqlService.listNotes(idEvent = idEvent, includeArchived = false)
    }
    fun createNote(params: UpsertNoteDto): Long {
        return sqlService.createNote(params)
    }
    fun updateNote(idNote: Long, params: UpsertNoteDto) {
        sqlService.updateNote(getOwnNote(idNote, params.idAccount), params)
    }
    @Transactional(rollbackFor = [Exception::class])
    fun deleteNote(idNote: Long, idAccount: Long) {
        getOwnNote(idNote, idAccount)
        sqlService.deleteNoteRelationships(idNote)
        sqlService.deleteNote(idNote)
    }

    /** Liga o bloco a um projeto ou evento, trocando o vínculo anterior. Sem parent, só desvincula. */
    @Transactional(rollbackFor = [Exception::class])
    fun attachNote(idNote: Long, idAccount: Long, parentEntity: NoteParentEnum?, parentId: Long?) {
        val note = getOwnNote(idNote, idAccount)
        sqlService.deleteNoteRelationships(idNote)
        if (parentEntity == null) return
        requireNotNull(parentId) { "parent-id é obrigatório junto com parent-entity." }
        when (parentEntity) {
            NoteParentEnum.PROJECT -> sqlService.createProjectNoteRelationship(parentId, note)
            NoteParentEnum.EVENT -> sqlService.createEventNoteRelationship(parentId, note)
        }
    }

    private fun getOwnNote(idNote: Long, idAccount: Long): Note {
        val note = sqlService.getNote(idNote)
        require(note.idAccount == idAccount) { "Bloco pertence a outro usuário." }
        return note
    }
}
