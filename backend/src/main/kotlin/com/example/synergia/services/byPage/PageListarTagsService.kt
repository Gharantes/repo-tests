package com.example.synergia.services.byPage

import com.example.synergia.domain.TagsEntity
import com.example.synergia.repositories.byDomain.TagsRepository
import com.example.synergia.models.byPage.pageListarTags.dto.input.FiltroListarTagsAllDto
import com.example.synergia.models.byPage.pageListarTags.dto.input.InsertTagDto
import com.example.synergia.models.byPage.pageListarTags.dto.output.ListarTagDto
import jakarta.validation.ConstraintViolationException
import org.springframework.dao.DataIntegrityViolationException
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import java.time.LocalDateTime

@Service
class PageListarTagsService (
    private val tagsRepository: TagsRepository,
    private val template: NamedParameterJdbcTemplate
) {

    fun listarTagsAll(params: FiltroListarTagsAllDto): List<ListarTagDto> {
        return com.example.synergia.repositories.byPage.pageListarTags.ListarTagsAllSql(params).query(template)
    }

    fun insertTag(params: InsertTagDto) {
        val tagsEntity = TagsEntity()
        tagsEntity.idTenant = params.idTenant
        tagsEntity.name = params.name
        tagsEntity.createdAt = LocalDateTime.now()
        try {
            tagsRepository.save(tagsEntity)
        } catch (_: DataIntegrityViolationException) {
            throw Exception("O nome de uma tag deve ser único.")
        } catch (_: ConstraintViolationException) {
            throw Exception("O nome de uma tag deve ser único.")
        }
    }

    fun deleteTag(id: Long) {
        tagsRepository.deleteById(id)
    }
}