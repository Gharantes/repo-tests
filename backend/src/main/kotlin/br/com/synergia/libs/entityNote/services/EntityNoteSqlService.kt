package br.com.synergia.libs.entityNote.services

import br.com.synergia.libs.entityNote.models.UpsertNoteDto
import br.com.synergia.libs.utilsEntities.jpa.event.EventRepository
import br.com.synergia.libs.utilsEntities.jpa.eventNoteRelationship.EventNoteRelationship
import br.com.synergia.libs.utilsEntities.jpa.eventNoteRelationship.EventNoteRelationshipRepository
import br.com.synergia.libs.utilsEntities.jpa.note.Note
import br.com.synergia.libs.utilsEntities.jpa.note.NoteRepository
import br.com.synergia.libs.utilsEntities.jpa.project.ProjectRepository
import br.com.synergia.libs.utilsEntities.jpa.projectNoteRelationship.ProjectNoteRelationship
import br.com.synergia.libs.utilsEntities.jpa.projectNoteRelationship.ProjectNoteRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.NoteDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import tools.jackson.module.kotlin.jacksonObjectMapper
import java.sql.Types
import java.time.LocalDateTime

@Service
class EntityNoteSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val noteRepository: NoteRepository,
    private val projectRepository: ProjectRepository,
    private val eventRepository: EventRepository,
    private val projectNoteRelationshipRepository: ProjectNoteRelationshipRepository,
    private val eventNoteRelationshipRepository: EventNoteRelationshipRepository
) {
    private val json = jacksonObjectMapper()

    fun listNotes(
        idAccount: Long? = null,
        idProject: Long? = null,
        idEvent: Long? = null,
        includeArchived: Boolean
    ): List<NoteDto> {
        val sql = SqlPath.EntityNote.LIST_NOTES.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_account", idAccount, Types.BIGINT)
            .addValue("id_project", idProject, Types.BIGINT)
            .addValue("id_event", idEvent, Types.BIGINT)
            .addValue("include_archived", includeArchived, Types.BOOLEAN)
        return template.query(sql, paramMap, EntityRowMapper.noteRowMapper)
    }

    fun getNote(idNote: Long): Note {
        return noteRepository.findById(idNote).orElseThrow { NoSuchElementException("Bloco $idNote não existe.") }
    }

    fun createNote(params: UpsertNoteDto): Long {
        val note = Note(
            idTenant = params.idTenant,
            idAccount = params.idAccount,
            type = params.type
        )
        applyChanges(note, params)
        return noteRepository.save(note).id!!
    }

    fun updateNote(note: Note, params: UpsertNoteDto) {
        applyChanges(note, params)
        noteRepository.save(note)
    }

    private fun applyChanges(note: Note, params: UpsertNoteDto) {
        val now = LocalDateTime.now()
        note.title = params.title
        note.content = params.content
        note.items = json.writeValueAsString(params.items)
        note.color = params.color
        note.pinned = params.pinned && !params.archived
        note.archivedAt = if (params.archived) note.archivedAt ?: now else null
        note.updatedAt = now
    }

    fun deleteNote(idNote: Long) {
        noteRepository.deleteById(idNote)
    }

    fun deleteNoteRelationships(idNote: Long) {
        projectNoteRelationshipRepository.deleteByIdNote(idNote)
        eventNoteRelationshipRepository.deleteByIdNote(idNote)
    }

    fun createProjectNoteRelationship(idProject: Long, note: Note) {
        val project = projectRepository.findById(idProject).orElseThrow { NoSuchElementException("Projeto $idProject não existe.") }
        require(project.idTenant == note.idTenant) { "Projeto de outro tenant." }
        projectNoteRelationshipRepository.save(ProjectNoteRelationship(idProject = idProject, idNote = note.id!!))
    }

    fun createEventNoteRelationship(idEvent: Long, note: Note) {
        val event = eventRepository.findById(idEvent).orElseThrow { NoSuchElementException("Evento $idEvent não existe.") }
        require(event.idTenant == note.idTenant) { "Evento de outro tenant." }
        eventNoteRelationshipRepository.save(EventNoteRelationship(idEvent = idEvent, idNote = note.id!!))
    }
}
