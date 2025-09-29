package com.example.synergia.rest.statistics

import com.example.synergia.models.statistics.dto.input.RegisterViewDto
import com.example.synergia.services.statistics.StatisticsViewService
import com.example.synergia.utils.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController @RequestMapping("/api/statistics")
class StatisticsResource (
    private val statisticsViewService: StatisticsViewService
) {
    @PostMapping("/register-view") fun registerView (
        @RequestBody body: RegisterViewDto
    ): ResponseEntity<Unit> =
        ResponseMessenger.buildResponse { statisticsViewService.registerView(body); null }
}