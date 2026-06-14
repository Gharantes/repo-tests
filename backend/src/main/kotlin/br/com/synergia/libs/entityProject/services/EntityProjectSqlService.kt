package br.com.synergia.libs.entityProject.services

import br.com.synergia.libs.entityProject.models.UpsertProjectDto
import br.com.synergia.libs.utilsCommons.extensions.parseStringToWildCard
import br.com.synergia.libs.utilsEntities.jpa.project.Project
import br.com.synergia.libs.utilsEntities.jpa.project.ProjectRepository
import br.com.synergia.libs.utilsEntities.jpa.projectAccountRelationship.ProjectAccountRelationship
import br.com.synergia.libs.utilsEntities.jpa.projectAccountRelationship.ProjectAccountRelationshipRepository
import br.com.synergia.libs.utilsEntities.jpa.projectTagRelationship.ProjectTagRelationship
import br.com.synergia.libs.utilsEntities.jpa.projectTagRelationship.ProjectTagRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.ProjectDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class EntityProjectSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val projectRepository: ProjectRepository,
    private val projectAccountRelationshipRepository: ProjectAccountRelationshipRepository,
    private val projectTagRelationshipRepository: ProjectTagRelationshipRepository
) {
    fun listProjectsByTenant(
        idTenant: Long,
        text: String?
    ): List<ProjectDto> {
        val sql = SqlPath.EntityProject.LIST_PROJECTS_BY_TENANT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_tenant", idTenant, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.projectRowMapper)
    }

    fun listProjectsByAccount(idAccount: Long, text: String?): List<ProjectDto> {
        val sql = SqlPath.EntityProject.LIST_PROJECTS_BY_ACCOUNT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_account", idAccount, Types.BIGINT)
            .addValue("text", text.parseStringToWildCard(), Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.projectRowMapper)
    }

    fun listProjectsByEvent(idEvent: Long, text: String?): List<ProjectDto> {
        val sql = SqlPath.PageExtendedEvent.LIST_PROJECTS_OF_EVENT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_event", idEvent, Types.BIGINT)
            .addValue("text", text, Types.VARCHAR)
        return template.query(sql, paramMap, EntityRowMapper.projectRowMapper)
    }

    fun createProject(params: UpsertProjectDto): Long {
        val project = Project(
            idTenant = params.idTenant,
            description = params.description,
            title = params.title,
            bannerUrl = params.bannerUrl
        )
        return projectRepository.save(project).id!!
    }

    fun createProjectAccountRelationship(idAccount: Long, idProject: Long) {
        val projectAccountRelationship = ProjectAccountRelationship(
            idAccount = idAccount,
            idProject = idProject,
            membershipLabel = "Líder"
        )
        projectAccountRelationshipRepository.save(projectAccountRelationship)
    }

    fun updateProject(idProject: Long, params: UpsertProjectDto) {
        val project = projectRepository.findById(idProject).orElseThrow()
        project.title = params.title
        project.description = params.description
        project.bannerUrl = params.bannerUrl
        projectRepository.save(project)
    }

    fun createProjectTagRelationship(idProject: Long, tags: List<Long>) {
        projectTagRelationshipRepository.saveAll(
            tags.map {
                ProjectTagRelationship(idProject=idProject, idTag=it)
            }
        )
    }

    fun deleteProjectTagRelationshipByIdProject(idProject: Long) {
        projectTagRelationshipRepository.deleteByIdProject(idProject)
    }

}