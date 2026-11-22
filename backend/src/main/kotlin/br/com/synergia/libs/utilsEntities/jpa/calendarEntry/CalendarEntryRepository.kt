package br.com.synergia.libs.utilsEntities.jpa.calendarEntry

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository

@Repository
interface CalendarEntryRepository : JpaRepository<CalendarEntry, Long>
