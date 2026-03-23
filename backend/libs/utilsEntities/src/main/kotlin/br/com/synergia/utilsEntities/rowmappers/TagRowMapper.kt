package br.com.synergia.utilsEntities.rowmappers

import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class TagRowMapper : RowMapper<TagDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): TagDto {
        return TagDto(
            id = rs.getLong("id_tag"),
            idTenant = rs.getLong("id_tenant"),
            title = rs.getString("tag_title"),
            createdAt = rs.getTimestamp("tag_created_at").toLocalDateTime(),
            forProjects = rs.getBoolean("tag_for_projects"),
            forEvents = rs.getBoolean("tag_for_events"),
            forAccounts = rs.getBoolean("tag_for_accounts"),
        )
    }
}