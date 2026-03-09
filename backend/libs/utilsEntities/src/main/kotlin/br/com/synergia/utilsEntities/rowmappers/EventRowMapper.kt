package br.com.synergia.utilsEntities.rowmappers

import br.com.synergia.utilsEntities.models.EventDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class EventRowMapper : RowMapper<EventDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): EventDto {
        return EventDto(
            id = rs.getLong("id_event"),
            idTenant = rs.getLong("id_tenant"),
            title = rs.getString("event_title"),
            description = rs.getString("event_description"),
            owner = EntityRowMapper.accountRowMapper.mapRow(rs, rowNum),
            tags = emptyList(),
            projects = emptyList()
        )
    }
}