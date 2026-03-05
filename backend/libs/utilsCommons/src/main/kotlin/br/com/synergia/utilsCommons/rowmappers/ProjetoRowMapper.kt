package br.com.synergia.utilsCommons.rowmappers

import br.com.synergia.utilsCommons.models.entities.ProjetoDto
import br.com.synergia.utilsCommons.objects.EntityRowMapper
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class ProjetoRowMapper : RowMapper<ProjetoDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): ProjetoDto {
        return ProjetoDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            description = rs.getString("description"),
            tenant = EntityRowMapper.tenantRowmapper.mapRow(rs, rowNum)
        )
    }
}