package br.com.synergia.rest

import br.com.synergia.pageListEventos.models.FiltroListarEventosAllDto
import br.com.synergia.pageListEventos.models.FiltroListarEventosByIdDto
import br.com.synergia.pageListEventos.models.ListarEventosDto
import br.com.synergia.pageListEventos.services.PageListEventosService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/listar-eventos")
class PageListEventosResource (
    private val service: PageListEventosService
) {
    @PostMapping("/listar-eventos")
    fun listarEventos(
        @RequestBody params: FiltroListarEventosAllDto
    ): ResponseEntity<List<ListarEventosDto>> {
        return ResponseMessenger.buildResponse { service.listarEventos(params) }
    }

    @DeleteMapping("/delete/{id}")
    fun deletarEvento(
        @PathVariable("id") id: Long
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.deletarEvento(id)
        }
    }
}