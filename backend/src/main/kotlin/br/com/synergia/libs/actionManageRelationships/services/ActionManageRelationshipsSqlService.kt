package br.com.synergia.libs.actionManageRelationships.services

import br.com.synergia.libs.utilsEntities.jpa.event.EventRepository
import br.com.synergia.libs.utilsEntities.jpa.project.ProjectRepository
import br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship.ProjectEventRelationship
import br.com.synergia.libs.utilsEntities.jpa.projectEventRelationship.ProjectEventRelationshipRepository
import br.com.synergia.libs.utilsEntities.models.EventDto
import br.com.synergia.libs.utilsEntities.rowmappers.EntityRowMapper
import br.com.synergia.libs.utilsSql.SqlPath
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.sql.Types

@Service
class ActionManageRelationshipsSqlService (
    private val template: NamedParameterJdbcTemplate,
    private val projectRepository: ProjectRepository,
    private val eventRepository: EventRepository,
    private val projectEventRelationshipRepository: ProjectEventRelationshipRepository
) {
    fun listEventsOfProject(idProject: Long): List<EventDto> {
        val sql = SqlPath.PageExtendedProject.LIST_EVENTS_OF_PROJECT.load()
        val paramMap = MapSqlParameterSource()
            .addValue("id_project", idProject, Types.BIGINT)
        return template.query(sql, paramMap, EntityRowMapper.eventRowMapper)
    }

    /** Projeto e evento precisam ser do mesmo tenant. Registrar de novo não duplica. */
    fun createRelationshipEventAndProject(
        idEvent: Long,
        idProject: Long,
    ) {
        val project = projectRepository.findById(idProject).orElseThrow { NoSuchElementException("Projeto $idProject não existe.") }
        val event = eventRepository.findById(idEvent).orElseThrow { NoSuchElementException("Evento $idEvent não existe.") }
        require(project.idTenant == event.idTenant) { "Evento de outro tenant." }
        if (projectEventRelationshipRepository.existsByIdProjectAndIdEvent(idProject, idEvent)) return
        projectEventRelationshipRepository.save(ProjectEventRelationship(idProject = idProject, idEvent = idEvent))
    }

    fun removeRelationshipEventAndProject(
        idEvent: Long,
        idProject: Long,
    ) {
        projectEventRelationshipRepository.deleteByIdProjectAndIdEvent(idProject, idEvent)
    }

    fun createRelationshipTagAndProject(
        idTag: Long,
        idProject: Long,
    ) {

    }
}
