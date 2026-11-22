package br.com.synergia.libs.utilsEntities.rowmappers

import br.com.synergia.libs.utilsCommons.enums.NoteParentEnum
import br.com.synergia.libs.utilsEntities.models.CalendarEntryDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class CalendarEntryRowMapper : RowMapper<CalendarEntryDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): CalendarEntryDto {
        return CalendarEntryDto(
            id = rs.getLong("id_calendar_entry"),
            idAccount = rs.getLong("id_account"),
            authorName = rs.getString("calendar_entry_author_name"),
            date = rs.getDate("calendar_entry_date").toLocalDate(),
            title = rs.getString("calendar_entry_title"),
            description = rs.getString("calendar_entry_description"),
            parentEntity = NoteParentEnum.valueOf(rs.getString("calendar_entry_parent_entity")),
            parentId = rs.getLong("calendar_entry_parent_id"),
            parentTitle = rs.getString("calendar_entry_parent_title"),
            updatedAt = rs.getTimestamp("calendar_entry_updated_at").toLocalDateTime()
        )
    }
}
