package br.com.synergia.utilsEntities.rowmappers

import br.com.synergia.utilsEntities.models.ProjectDto
import org.springframework.jdbc.core.RowMapper
import java.sql.ResultSet

class ProjectRowMapper : RowMapper<ProjectDto> {
    override fun mapRow(rs: ResultSet, rowNum: Int): ProjectDto {
        return ProjectDto(
            id = rs.getLong("id_project"),
            idTenant = rs.getLong("id_tenant"),
            title = rs.getString("project_title"),
            description = rs.getString("project_description"),
            tenant = EntityRowMapper.tenantRowMapper.mapRow(rs, rowNum),
            tags = emptyList(),
            events = emptyList()
        )
    }
}