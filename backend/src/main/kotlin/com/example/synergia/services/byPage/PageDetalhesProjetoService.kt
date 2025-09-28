package com.example.synergia.services.byPage

import com.example.synergia.domain.ProjectEventRelationshipEntity
import com.example.synergia.domain.ProjectTagRelationshipEntity
import com.example.synergia.repositories.byDomain.ProjectEventRelationshipRepository
import com.example.synergia.repositories.byDomain.ProjectTagRelationshipRepository
import com.example.synergia.repositories.byPage.pageDetalhesProjeto.GetEventsOfProjectSql
import com.example.synergia.repositories.byPage.pageDetalhesProjeto.GetProjectDetailsDtoByIdSql
import com.example.synergia.repositories.byPage.pageDetalhesProjeto.GetTagsOfProjectSql
import com.example.synergia.models.byPage.pageDetalhesProjeto.dto.output.ProjectDetailsDto
import com.example.synergia.utils.models.generics.GenericIdTextDto
import jakarta.transaction.Transactional
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageDetalhesProjetoService (
    private val template: NamedParameterJdbcTemplate,
    private val projectEventRelationshipRepository: ProjectEventRelationshipRepository,
    private val projectTagRelationshipRepository: ProjectTagRelationshipRepository
) {
    fun getProjectDetailsDtoById(id: Long): ProjectDetailsDto {
        return GetProjectDetailsDtoByIdSql(id).queryForObject(template)!!
    }
    fun getEventsOfProject(id: Long): List<GenericIdTextDto> {
        return GetEventsOfProjectSql(id).query(template)
    }
    fun getTagsOfProject(id: Long): List<GenericIdTextDto> {
        return GetTagsOfProjectSql(id).query(template)
    }
    fun addEventToProject(idProject: Long, idEvent: Long) {
        val entity = ProjectEventRelationshipEntity()
        entity.idProject=idProject
        entity.idEvent=idEvent
        projectEventRelationshipRepository.save(entity)
    }
    fun removeEventFromProject(idProject: Long, idEvent: Long) {
        projectEventRelationshipRepository.deleteByIdProjectAndIdEvent(idProject, idEvent)
    }
    fun addTagToProject(idProject: Long, idTag: Long) {
        val entity = ProjectTagRelationshipEntity()
        entity.idProject = idProject
        entity.idTag = idTag
        projectTagRelationshipRepository.save(entity)
    }

    @Transactional
    fun removeTagFromProject(idProject: Long, idTag: Long) {
        projectTagRelationshipRepository.deleteByIdProjectAndIdTag(idProject, idTag)
    }
}