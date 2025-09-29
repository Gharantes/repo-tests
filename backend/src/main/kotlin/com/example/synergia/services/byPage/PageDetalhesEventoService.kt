package com.example.synergia.services.byPage

import com.example.synergia.repositories.byPage.pageDetalhesEvento.ListarProjetosOfEventoSql
import com.example.synergia.models.byPage.pageDetalhesEvento.dto.input.FiltroListarProjetosOfEventoDto
import com.example.synergia.models.byPage.pageDetalhesEvento.dto.output.ListarProjetosOfEventoDto
import com.example.synergia.repositories.byPage.pageDetalhesEvento.GetTagsOfEventSql
import com.example.synergia.utils.models.generics.GenericIdTextDto
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service

@Service
class PageDetalhesEventoService (
    private val template: NamedParameterJdbcTemplate
) {
    fun listarProjetosOfEvento(
        params: FiltroListarProjetosOfEventoDto
    ): List<ListarProjetosOfEventoDto> =
        ListarProjetosOfEventoSql(params).query(template)

    fun getTagsOfProject(idRef: Long): List<GenericIdTextDto> {
        return GetTagsOfEventSql(idRef).query(template)
    }
}