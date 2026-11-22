package br.com.synergia.libs.entityCalendar.services

import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.jpa.account.AccountRepository
import br.com.synergia.libs.utilsEntities.jpa.calendarEntry.CalendarEntry
import br.com.synergia.libs.utilsEntities.jpa.calendarEntry.CalendarEntryRepository
import br.com.synergia.libs.utilsEntities.jpa.event.EventRepository
import br.com.synergia.libs.utilsEntities.jpa.eventAccountRelationship.EventAccountRelationshipRepository
import br.com.synergia.libs.utilsEntities.jpa.project.ProjectRepository
import br.com.synergia.libs.utilsEntities.jpa.projectAccountRelationship.ProjectAccountRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.CalendarEntryDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types
import java.time.LocalDate
import java.time.LocalDateTime

@Service
class EntityCalendarSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val calendarEntryRepository: CalendarEntryRepository,
    private val accountRepository: AccountRepository,
    private val projectRepository: ProjectRepository,
    private val eventRepository: EventRepository,
    private val projectAccountRelationshipRepository: ProjectAccountRelationshipRepository,
    private val eventAccountRelationshipRepository: EventAccountRelationshipRepository
) {
    fun listEntries(idProject: Long? = null, idEvent: Long? = null): List<CalendarEntryDto> {
        val sql = SqlPath.EntityCalendar.LIST_CALENDAR_ENTRIES.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_project", idProject, Types.BIGINT)
            .addValue("id_event", idEvent, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.calendarEntryRowMapper)
    }

    fun getEntry(idEntry: Long): CalendarEntry {
        return calendarEntryRepository.findById(idEntry).orElseThrow { NoSuchElementException("Data $idEntry não existe.") }
    }

    fun createEntry(
        parentEntity: NoteParentEnum,
        parentId: Long,
        idAccount: Long,
        date: LocalDate,
        title: String,
        description: String
    ): Long {
        val account = accountRepository.findById(idAccount).orElseThrow { NoSuchElementException("Conta $idAccount não existe.") }
        val entry = CalendarEntry(
            idTenant = account.idTenant,
            idAccount = idAccount,
            parentEntity = parentEntity,
            parentId = parentId,
            date = date,
            title = title,
            description = description
        )
        return calendarEntryRepository.save(entry).id!!
    }

    fun updateEntry(entry: CalendarEntry, date: LocalDate, title: String, description: String) {
        entry.date = date
        entry.title = title
        entry.description = description
        entry.updatedAt = LocalDateTime.now()
        calendarEntryRepository.save(entry)
    }

    fun deleteEntry(idEntry: Long) {
        calendarEntryRepository.deleteById(idEntry)
    }

    /** O dono precisa existir, e quem mexe na data precisa ser membro dele. */
    fun requireMember(parentEntity: NoteParentEnum, parentId: Long, idAccount: Long) {
        when (parentEntity) {
            NoteParentEnum.PROJECT -> {
                if (!projectRepository.existsById(parentId)) throw NoSuchElementException("Projeto $parentId não existe.")
                require(projectAccountRelationshipRepository.existsByIdProjectAndIdAccount(parentId, idAccount)) {
                    "Só membros do projeto mexem no calendário dele."
                }
            }
            NoteParentEnum.EVENT -> {
                if (!eventRepository.existsById(parentId)) throw NoSuchElementException("Evento $parentId não existe.")
                require(eventAccountRelationshipRepository.existsByIdEventAndIdAccount(parentId, idAccount)) {
                    "Só membros do evento mexem no calendário dele."
                }
            }
        }
    }
}
