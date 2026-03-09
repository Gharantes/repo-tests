package br.com.synergia.utilsEntities.rowmappers

import br.com.synergia.utilsEntities.models.TagDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class TagRowMapper : RowMapper<TagDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): TagDto {
        return TagDto(
            id = rs.getLong("id"),
            label = rs.getString("name"),
        )
    }
}