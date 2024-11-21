package com.example.synergia.mappers

import com.example.synergia.domain.Project
import com.example.synergia.dto.entity_mirror.ProjectDto
import com.example.synergia.dto.input.ProjectCreateDto
import com.example.synergia.dto.input.ProjectUpdateDto

class ProjectMapper {
    fun entityToProjectDto(entity: Project): ProjectDto {
        return ProjectDto(
            id = entity.id!!,
            idTenant = entity.idTenant!!,
            title = entity.title!!,
            description = entity.description!!,
        )
    }
    fun projectDtoToEntity(dto: ProjectDto): Project {
        return Project().apply {
            id = dto.id
            idTenant = dto.idTenant
            title = dto.title
            description = dto.description
        }
    }
    fun projectCreateDtoToEntity(dto: ProjectCreateDto): Project {
        return Project().apply {
            idTenant = dto.idTenant
            title = dto.title
            description = dto.description
        }
    }
    fun projectUpdateDtoToEntity(dto: ProjectUpdateDto): Project {
        return Project().apply {
            id = dto.id
            title = dto.title
            description = dto.description
        }
    }
}
