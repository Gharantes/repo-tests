package br.com.synergia.libs.utilsEntities.rowmappers

import br.com.synergia.libs.utilsEntities.models.EventDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class EventRowMapper : RowMapper<EventDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): EventDto {
        return EventDto(
            id = rs.getLong("id_event"),
            idTenant = rs.getLong("id_tenant"),
            title = rs.getString("event_title"),
            description = rs.getString("event_description"),
            bannerUrl = rs.getString("event_banner_url"),
            bannerColor = rs.getString("event_banner_color"),
            tags = emptyList(),
            projects = emptyList()
        )
    }
}