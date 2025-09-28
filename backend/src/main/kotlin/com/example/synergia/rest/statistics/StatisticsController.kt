package com.example.synergia.rest.statistics

import com.example.synergia.models.byPage.pageAtribuirPermissoes.dto.output.ListarPermissoesDto
import com.example.synergia.models.statistics.dto.input.RegisterViewDto
import com.example.synergia.services.statistics.StatisticsService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/statistics")
class StatisticsController (
    private val statisticsService: StatisticsService
) {
    @PostMapping("/register-view") fun registerView (
        @RequestBody body: RegisterViewDto
    ): ResponseEntity<Unit> =
        ResponseMessenger.buildResponse { statisticsService.registerView(body); null }
}