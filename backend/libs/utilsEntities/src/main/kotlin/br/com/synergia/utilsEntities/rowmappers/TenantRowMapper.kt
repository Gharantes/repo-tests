package br.com.synergia.utilsEntities.rowmappers

import br.com.synergia.utilsEntities.models.TenantDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class TenantRowMapper : RowMapper<TenantDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): TenantDto {
        return TenantDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            identifier = rs.getString("identifier")
        )
    }
}