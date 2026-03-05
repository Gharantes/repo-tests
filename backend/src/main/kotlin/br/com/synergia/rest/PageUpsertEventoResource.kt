package br.com.synergia.rest

import br.com.synergia.pageUpsertEventos.models.CreateEventoDto
import br.com.synergia.pageUpsertEventos.models.UpdateEventoDto
import br.com.synergia.pageUpsertEventos.services.PageUpsertEventoService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/upsert-evento")
class PageUpsertEventoResource(
    private val service: PageUpsertEventoService
) {
    @GetMapping("get-by-id/{id}")
    fun getCreateEventoDtoById(
        @PathVariable("id") id: Long
    ): ResponseEntity<CreateEventoDto?> {
        return ResponseMessenger.buildResponse {
            service.getCreateEventoDtoById(id)
        }
    }

    @PostMapping("store")
    fun createEvento(
        @RequestBody params: CreateEventoDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.createEvento(params)
        }
    }

    @PostMapping("update")
    fun updateEvento(
        @RequestBody params: UpdateEventoDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updateEvento(params)
        }
    }
}
