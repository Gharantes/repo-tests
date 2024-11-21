package com.example.synergia.rest.domain_based

import com.example.synergia.utils.objects.ResponseMessenger
import com.example.synergia.dto.entity_mirror.ProjectDto
import com.example.synergia.dto.input.ProjectCreateDto
import com.example.synergia.dto.input.ProjectUpdateDto
import com.example.synergia.services.ProjectService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/project")
class ProjectResource (
    private val projectService: ProjectService,
) {
    @GetMapping("get-by-id//{id_tenant}/{id}")
    fun getProjectById(
        @PathVariable("id_tenant") idTenant: Long,
        @PathVariable("id") id: Long
    ): ResponseEntity<ProjectDto?> {
        return ResponseMessenger.buildResponse(null) {
            projectService.getById(idTenant, id);
        }
    }
    @GetMapping("get-all/{id_tenant}")
    fun getAllProjects(
        @PathVariable("id_tenant") idTenant: Long
    ): ResponseEntity<List<ProjectDto>> {
        return ResponseMessenger.buildResponse(null) {
            projectService.getAll(idTenant)
        }
    }
    @PostMapping("create-project")
    fun createProject(
        @RequestBody projectCreateDto: ProjectCreateDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            projectService.createProject(projectCreateDto);
            null
        }
    }
    @PostMapping("update-project")
    fun updateProject(
        @RequestBody projectUpdateDto: ProjectUpdateDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            projectService.updateProject(projectUpdateDto);
            null
        }
    }
    @DeleteMapping("delete-project/{id_tenant}/{id}")
    fun deleteProject(
        @PathVariable("id_tenant") idTenant: Long,
        @PathVariable("id") id: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            projectService.deleteProject(idTenant, id);
            null
        }
    }
}
