package br.com.synergia.libs.utilsEntities.rowmappers

import br.com.synergia.libs.utilsEntities.models.ProjectDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class ProjectRowMapper : RowMapper<ProjectDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): ProjectDto {
        return ProjectDto(
            id = rs.getLong("id_project"),
            idTenant = rs.getLong("id_tenant"),
            title = rs.getString("project_title"),
            description = rs.getString("project_description"),
            bannerUrl = rs.getString("project_banner_url"),
            bannerColor = rs.getString("project_banner_color"),
            tenant = null,
            tags = emptyList(),
            events = emptyList()
        )
    }
}