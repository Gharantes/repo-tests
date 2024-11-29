package com.example.synergia.services

import com.example.synergia.domain.Project
import com.example.synergia.dto.entity_mirror.ProjectDto
import com.example.synergia.dto.input.ProjectCreateDto
import com.example.synergia.dto.input.ProjectUpdateDto
import com.example.synergia.mappers.ProjectMapper
import com.example.synergia.repositories.ProjectRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service

@Service
class ProjectService(
    private val projectRepository: ProjectRepository,
) {
    fun getById(idTenant: Long, id: Long): ProjectDto? {
        return projectRepository.findByIdTenantAndId(idTenant, id)
            ?.let { ProjectMapper().entityToProjectDto(it) }
    }
    fun getAll(
        idTenant: Long,
        textSearch: String?
    ): List<ProjectDto> {
        val mapper = ProjectMapper()
        return projectRepository.findAllByIdTenant(idTenant)
            .map { mapper.entityToProjectDto(it) }
    }
    fun createProject(projectCreateDto: ProjectCreateDto) {
        projectRepository.save(
            ProjectMapper().projectCreateDtoToEntity(projectCreateDto)
        )
    }
    fun updateProject(projectUpdateDto: ProjectUpdateDto) {
        projectRepository.save(
            ProjectMapper().projectUpdateDtoToEntity(projectUpdateDto)
        )
    }
    @Transactional
    fun deleteProject(idTenant: Long, id: Long) {
        projectRepository.deleteByIdTenantAndId(idTenant, id)
    }
}
