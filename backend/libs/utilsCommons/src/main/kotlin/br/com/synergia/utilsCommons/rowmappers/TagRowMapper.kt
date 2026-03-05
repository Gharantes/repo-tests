package br.com.synergia.utilsCommons.rowmappers

import br.com.synergia.utilsCommons.models.entities.TagDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class TagRowMapper : RowMapper<TagDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): TagDto? {
        return TagDto(
            id = rs.getLong("id"),
            label = rs.getString("name"),
        )
    }
}