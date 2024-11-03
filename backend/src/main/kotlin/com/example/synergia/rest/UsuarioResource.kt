package com.example.synergia.rest

import com.example.synergia.dto.entity_mirror.UsuarioDto
import com.example.synergia.services.UsuarioService
import com.example.synergia.utils.objects.MediaTypes
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestPart
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.multipart.MultipartFile

@RestController
@RequestMapping("/api/usuario")
class UsuarioResource (
    private val userService: UsuarioService,
) {
    @GetMapping(
        "get-by-id/{id-usuario}",
        produces = [MediaTypes.JSON]
    ) fun getUserById(
        @PathVariable("id-usuario") idUsuario: Long,
    ): ResponseEntity<UsuarioDto?> {

        return ResponseMessenger.buildResponse(null) {
            userService.getById(idUsuario);
        }
    }
    @GetMapping(
        "get-all",
        produces = [MediaTypes.JSON]
    ) fun getAllUsers(): ResponseEntity<List<UsuarioDto>> {
        return ResponseMessenger.buildResponse(null) {
            userService.getAll();
        }
    }
    @PostMapping(
        "create-users-from-file",
        consumes = [MediaTypes.FILE]
    ) fun createUsersFromFile(
        @RequestPart("file") file: MultipartFile,
    ): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            userService.createUsersFromFile(file, false)
            null
        }
    }
    @PostMapping(
        "export-users-as-excel",
        produces = [MediaTypes.XLSX],
    ) fun exportUsersAsExcel(): ResponseEntity<Void> {
        return ResponseMessenger.buildResponse(null) {
            userService.exportUsersAsExcel()
            null
        }
    }
}
