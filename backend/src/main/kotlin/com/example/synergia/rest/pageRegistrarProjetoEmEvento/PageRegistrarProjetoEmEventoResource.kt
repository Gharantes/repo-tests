package com.example.synergia.rest.pageRegistrarProjetoEmEvento

import com.example.synergia.rest.pageLogin.dto.input.LoginInformationInputDto
import com.example.synergia.rest.pageLogin.dto.output.LoginInformationResponseDto
import com.example.synergia.rest.pageLogin.dto.output.LoginTenantInformationDto
import com.example.synergia.rest.pageRegistrarProjetoEmEvento.dto.output.ListarEventosDisponiveisDto
import com.example.synergia.services.PageLoginService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/page-registrar-projeto-em-evento")
class PageRegistrarProjetoEmEventoResource (
) {
    @GetMapping("/listar-eventos-disponiveis")
    fun listarEventosDisponiveis(): ResponseEntity<List<ListarEventosDisponiveisDto>> =
        ResponseMessenger.buildResponse { emptyList() }

    @PostMapping("/registrar-projeto-em-evento")
    fun checkLoginInformation(
        @RequestParam("id-evento") idEvento: Long,
        @RequestParam("id-projeto") idProjeto: Long
    ): ResponseEntity<LoginInformationResponseDto?> =
        ResponseMessenger.buildResponse {
            println(idEvento)
            println(idProjeto)
            null
        }
}