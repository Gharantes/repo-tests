package com.example.synergia.services.statistics

import com.example.synergia.domain.statistics.StatisticsViewsEntity
import com.example.synergia.models.statistics.dto.input.RegisterViewDto
import com.example.synergia.repositories.byDomain.statistics.StatisticsViewsRepository
import com.example.synergia.services.byPage.PageDetalhesEventoService
import com.example.synergia.services.byPage.PageDetalhesProjetoService
import com.example.synergia.utils.enums.EntityRefEnum
import com.example.synergia.utils.models.generics.GenericIdTextDto
import org.springframework.stereotype.Service

@Service
class StatisticsViewService (
    private val statisticsViewsRepository: StatisticsViewsRepository,
    private val pageDetalhesProjetoService: PageDetalhesProjetoService,
    private val pageDetalhesEventoService: PageDetalhesEventoService
) {
    fun registerView(body: RegisterViewDto) {
        val entity = StatisticsViewsEntity(
            idTenant=body.idTenant,
            idAccount=body.idAccount,
            idRef=body.idRef,
            entityRef=body.entityRef,
        )
        statisticsViewsRepository.save(entity)

        when (body.entityRef) {
            EntityRefEnum.EVENT -> registerViewOfTags(body, pageDetalhesEventoService.getTagsOfProject(body.idRef))
            EntityRefEnum.PROJECT -> registerViewOfTags(body, pageDetalhesProjetoService.getTagsOfProject(body.idRef))
            else -> {}
        }
    }

    private fun registerViewOfTags(
        body: RegisterViewDto,
        tags: List<GenericIdTextDto>
    ) {
        tags.forEach { tag ->
            registerView(RegisterViewDto(
                idTenant=body.idTenant,
                idAccount=body.idAccount,
                idRef=tag.id,
                entityRef=EntityRefEnum.TAG
            ))
        }
    }
}