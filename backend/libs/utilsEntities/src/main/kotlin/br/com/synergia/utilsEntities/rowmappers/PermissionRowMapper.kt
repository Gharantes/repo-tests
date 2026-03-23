package br.com.synergia.utilsEntities.rowmappers

import br.com.synergia.utilsEntities.models.PermissionDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class PermissionRowMapper : RowMapper<PermissionDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): PermissionDto {
        return PermissionDto(
            id=rs.getLong("id"),
            name=rs.getString("name")
        )
    }
}