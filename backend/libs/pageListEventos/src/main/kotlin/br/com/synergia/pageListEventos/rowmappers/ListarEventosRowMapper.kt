package br.com.synergia.pageListEventos.rowmappers

import br.com.synergia.pageListEventos.models.ListarEventosDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class ListarEventosRowMapper : RowMapper<ListarEventosDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): ListarEventosDto? {
        return ListarEventosDto(
            id = rs.getLong("id"),
            title = rs.getString("title"),
            description = rs.getString("description"),
            createdByIdAccount = rs.getLong("created_by"),
            createdByNameAccount = rs.getString("created_by_name"),
            bannerUrl = rs.getString("url_banner"),
            userIsMember = rs.getBoolean("user_is_member")
        )
    }
}