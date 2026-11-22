package br.com.synergia.libs.entityCalendar.services

import br.com.synergia.libs.entityCalendar.models.UpsertCalendarEntryDto
import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.jpa.calendarEntry.CalendarEntry
import br.com.synergia.libs.utilsEntities.models.CalendarEntryDto
import org.springframework.stereotype.Service

/**
 * Calendário de projetos e eventos: datas com título e descrição, marcadas pelos membros.
 * O calendário do projeto mostra também as datas dos eventos em que ele está registrado
 * (ali só para ver: quem mexe nelas são os membros do evento). As do projeto não aparecem no evento.
 */
@Service
class EntityCalendarService (
    private val sqlService: EntityCalendarSqlService
) {
    fun listEntriesOfProject(idProject: Long): List<CalendarEntryDto> {
        return sqlService.listEntries(idProject = idProject)
    }
    fun listEntriesOfEvent(idEvent: Long): List<CalendarEntryDto> {
        return sqlService.listEntries(idEvent = idEvent)
    }

    fun createEntry(parentEntity: NoteParentEnum, parentId: Long, params: UpsertCalendarEntryDto): Long {
        val title = requireTitle(params.title)
        sqlService.requireMember(parentEntity, parentId, params.idAccount)
        return sqlService.createEntry(parentEntity, parentId, params.idAccount, params.date, title, params.description.trim())
    }

    fun updateEntry(idEntry: Long, params: UpsertCalendarEntryDto) {
        val title = requireTitle(params.title)
        val entry = getEntryAsMember(idEntry, params.idAccount)
        sqlService.updateEntry(entry, params.date, title, params.description.trim())
    }

    fun deleteEntry(idEntry: Long, idAccount: Long) {
        getEntryAsMember(idEntry, idAccount)
        sqlService.deleteEntry(idEntry)
    }

    private fun requireTitle(title: String): String {
        val trimmed = title.trim()
        require(trimmed.isNotEmpty()) { "A data precisa de um título." }
        return trimmed
    }

    /** Qualquer membro do dono da data pode editá-la ou apagá-la, não só quem criou. */
    private fun getEntryAsMember(idEntry: Long, idAccount: Long): CalendarEntry {
        val entry = sqlService.getEntry(idEntry)
        sqlService.requireMember(entry.parentEntity, entry.parentId, idAccount)
        return entry
    }
}
