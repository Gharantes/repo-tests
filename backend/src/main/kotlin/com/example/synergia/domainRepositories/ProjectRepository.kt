package com.example.synergia.domainRepositories

import com.example.synergia.domain.ProjectEntity
import org.springframework.data.jpa.repository.JpaRepository

interface ProjectRepository : JpaRepository<ProjectEntity, Long> {}