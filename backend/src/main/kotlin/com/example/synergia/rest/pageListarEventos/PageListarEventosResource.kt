package com.example.synergia.rest.pageListarEventos

import com.example.synergia.rest.pageListarEventos.dto.output.ListarEventosBasicInfoDto
import com.example.synergia.rest.pageLogin.dto.input.LoginInformationInputDto
import com.example.synergia.rest.pageLogin.dto.output.LoginInformationResponseDto
import com.example.synergia.rest.pageLogin.dto.output.LoginTenantInformationDto
import com.example.synergia.services.PageListarEventosService
import com.example.synergia.services.PageLoginService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/listar-eventos")
class PageListarEventosResource (
    private val service: PageListarEventosService
) {
    @GetMapping("/all")
    fun listarEventosAll(): ResponseEntity<List<ListarEventosBasicInfoDto>> =
        ResponseMessenger.buildResponse {
            service.listarEventosAll()
        }
}