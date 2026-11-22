package br.com.synergia.libs.utilsEntities.models

import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import java.time.LocalDate
import java.time.LocalDateTime

/**
 * Data do calendário. No calendário de um projeto vêm também as datas dos eventos em que ele
 * está registrado; `parentEntity`/`parentId`/`parentTitle` dizem de onde cada uma vem.
 */
data class CalendarEntryDto(
    val id: Long,
    val idAccount: Long,
    val authorName: String,
    val date: LocalDate,
    val title: String,
    val description: String,
    val parentEntity: NoteParentEnum,
    val parentId: Long,
    val parentTitle: String,
    val updatedAt: LocalDateTime
)
