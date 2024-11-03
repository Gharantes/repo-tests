package com.example.synergia.rest

import com.example.synergia.dto.entity_mirror.EventoDto
import com.example.synergia.services.EventoService
import com.example.synergia.services.SystemService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/system")
class SystemResource (
    private val systemService: SystemService
) {
    @GetMapping("get-by-id/{id-system}")
    fun getSystemById(
        @PathVariable("id-system") idSystem: Long
    ): ResponseEntity<EventoDto?> {
        return ResponseMessenger.buildResponse(null) {
            systemService.getById(idSystem)
            null
        }
    }

    @GetMapping("get-all")
    fun getAllSystems(): ResponseEntity<EventoDto?> {
        return ResponseMessenger.buildResponse(null) {
            systemService.getAll()
            null
        }
    }
}
