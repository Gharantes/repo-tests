package br.com.synergia.utilsCommons.rowmappers

import br.com.synergia.utilsCommons.models.entities.TenantDto
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