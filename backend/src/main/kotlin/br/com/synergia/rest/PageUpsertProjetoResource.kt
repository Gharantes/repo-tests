package br.com.synergia.rest

import br.com.synergia.pageUpsertProjetos.models.CreateProjetoDto
import br.com.synergia.pageUpsertProjetos.models.UpdateProjetoDto
import br.com.synergia.pageUpsertProjetos.services.PageUpsertProjetoService
import br.com.synergia.utilsCommons.objects.ResponseMessenger
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/create-projeto")
class PageUpsertProjetoResource (
    private val service: PageUpsertProjetoService
) {
    @GetMapping("get-by-id/{id}")
    fun getCreateProjetoDtoById(
        @PathVariable("id") id: Long
    ): ResponseEntity<CreateProjetoDto?> {
        return ResponseMessenger.buildResponse {
            service.getCreateProjetoDtoById(id)
        }
    }

    @PostMapping("store")
    fun createProjeto(
        @RequestBody params: CreateProjetoDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.createProjeto(params)
        }
    }

    @PostMapping("update")
    fun updateProjeto(
        @RequestBody params: UpdateProjetoDto
    ): ResponseEntity<Void> {
        return ResponseMessenger.responseWithoutReturn {
            service.updateProjeto(params)
        }
    }
}