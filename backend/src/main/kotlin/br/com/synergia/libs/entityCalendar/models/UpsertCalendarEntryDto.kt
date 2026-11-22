package br.com.synergia.libs.entityCalendar.models

import java.time.LocalDate

/** Criar ou editar uma data. Quem chama (`idAccount`) precisa ser membro do dono da data. */
data class UpsertCalendarEntryDto(
    val idAccount: Long,
    val date: LocalDate,
    val title: String,
    val description: String = ""
)
