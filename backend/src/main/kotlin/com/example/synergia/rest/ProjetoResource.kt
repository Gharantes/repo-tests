package com.example.synergia.rest

import com.example.synergia.utils.objects.ResponseMessenger
import com.example.synergia.dto.entity_mirror.ProjetoDto
import com.example.synergia.dto.input.CreateProjetoDto
import com.example.synergia.services.ProjetoService
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
class ProjetoResource (
    private val projectService: ProjetoService,
) {
    @GetMapping("get-by-id/{id-project}")
    fun getProjectById(
        @PathVariable("id-project") idProjeto: Long
    ): ResponseEntity<ProjetoDto?> {
        return ResponseMessenger.buildResponse(null) {
            projectService.getById(idProjeto);
        }
    }
    @GetMapping("get-all")
    fun getAllProjects(): ResponseEntity<List<ProjetoDto>> {
        return ResponseMessenger.buildResponse(null) {
            projectService.getAll();
        }
    }
    @PostMapping("create-project")
    fun createProject(
        @RequestBody createProjetoDto: CreateProjetoDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            projectService.createProjeto(createProjetoDto);
            null
        }
    }
    @PostMapping("assign-projeto-to-evento/{id-project}/{id-evento}")
    fun assignProjectToEvent(
        @PathVariable("id-project") idProjeto: Long,
        @PathVariable("id-evento") idEvento: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            projectService.assignProjetoToEvento(idProjeto, idEvento);
            null
        }
    }
    @DeleteMapping("delete-project/{id-project}")
    fun deleteProject(
        @PathVariable("id-project") idProjeto: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            projectService.deleteProjeto(idProjeto);
            null
        }
    }
}
